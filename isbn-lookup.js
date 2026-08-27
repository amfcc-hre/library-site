(function (global) {
  "use strict";

  var SEARCH_FIELDS = [
    "key",
    "title",
    "subtitle",
    "author_name",
    "publisher",
    "first_publish_year",
    "subject",
    "cover_i",
    "editions",
    "editions.key",
    "editions.title",
    "editions.subtitle",
    "editions.publisher",
    "editions.publish_date",
    "editions.isbn",
    "editions.cover_i"
  ].join(",");

  function validIsbn13(value) {
    if (!/^97[89]\d{10}$/.test(value)) return false;
    var sum = 0;
    for (var i = 0; i < 13; i += 1) {
      sum += Number(value.charAt(i)) * (i % 2 === 0 ? 1 : 3);
    }
    return sum % 10 === 0;
  }

  function validIsbn10(value) {
    if (!/^\d{9}[\dX]$/.test(value)) return false;
    var sum = 0;
    for (var i = 0; i < 10; i += 1) {
      var digit = value.charAt(i) === "X" ? 10 : Number(value.charAt(i));
      sum += digit * (10 - i);
    }
    return sum % 11 === 0;
  }

  function normalizeIsbn(value) {
    var compact = String(value == null ? "" : value).toUpperCase().replace(/[^0-9X]/g, "");
    var i;

    for (i = 0; i <= compact.length - 13; i += 1) {
      var candidate13 = compact.slice(i, i + 13);
      if (validIsbn13(candidate13)) return candidate13;
    }

    if (compact.length < 13) {
      for (i = 0; i <= compact.length - 10; i += 1) {
        var candidate10 = compact.slice(i, i + 10);
        if (validIsbn10(candidate10)) return candidate10;
      }
    }

    throw new Error("Scan or enter a valid 10 or 13 digit ISBN.");
  }

  function firstValue(value) {
    if (Array.isArray(value)) return value.length ? value[0] : "";
    return value || "";
  }

  function publicationYear(value, fallback) {
    var values = Array.isArray(value) ? value : [value];
    for (var i = 0; i < values.length; i += 1) {
      var match = String(values[i] || "").match(/(?:1[0-9]{3}|20[0-9]{2}|21[0-9]{2})/);
      if (match) return Number(match[0]);
    }
    return fallback ? Number(fallback) : "";
  }

  function editionForIsbn(document, isbn) {
    var editions = document && document.editions && Array.isArray(document.editions.docs)
      ? document.editions.docs
      : [];
    return editions.find(function (edition) {
      return (edition.isbn || []).some(function (value) {
        try { return normalizeIsbn(value) === isbn; }
        catch (error) { return false; }
      });
    }) || editions[0] || {};
  }

  function buildSearchUrl(isbn) {
    var normalized = normalizeIsbn(isbn);
    return "https://openlibrary.org/search.json?q=" + encodeURIComponent("isbn:" + normalized) +
      "&fields=" + encodeURIComponent(SEARCH_FIELDS) + "&limit=1";
  }

  function mapBook(document, isbn) {
    var edition = editionForIsbn(document, isbn);
    var key = edition.key || document.key || "";
    var coverId = edition.cover_i || document.cover_i || "";
    var subjects = Array.isArray(document.subject) ? document.subject.slice(0, 3) : [];

    return {
      isbn: isbn,
      title: edition.title || document.title || "",
      subtitle: edition.subtitle || document.subtitle || "",
      author: Array.isArray(document.author_name) ? document.author_name.join(", ") : "",
      publisher: firstValue(edition.publisher) || firstValue(document.publisher),
      publicationYear: publicationYear(edition.publish_date, document.first_publish_year),
      category: subjects.join(", "),
      coverUrl: coverId ? "https://covers.openlibrary.org/b/id/" + encodeURIComponent(coverId) + "-M.jpg" : "",
      sourceUrl: /^\/(?:books|works)\//.test(key) ? "https://openlibrary.org" + key : "https://openlibrary.org/search?q=" + encodeURIComponent("isbn:" + isbn)
    };
  }

  async function lookup(isbn, fetchImplementation) {
    var normalized = normalizeIsbn(isbn);
    var fetcher = fetchImplementation || global.fetch;
    if (typeof fetcher !== "function") throw new Error("Internet book lookup is not supported by this browser.");

    var controller = typeof global.AbortController === "function" ? new global.AbortController() : null;
    var timer = controller ? global.setTimeout(function () { controller.abort(); }, 12000) : null;

    try {
      var response = await fetcher(buildSearchUrl(normalized), {
        headers: { "Accept": "application/json" },
        signal: controller ? controller.signal : undefined
      });
      if (!response.ok) throw new Error("The online book service returned an error.");
      var data = await response.json();
      if (!data || !Array.isArray(data.docs) || !data.docs.length) return null;
      return mapBook(data.docs[0], normalized);
    } catch (error) {
      if (error && error.name === "AbortError") throw new Error("The online book search took too long. Check the internet connection and try again.");
      throw error;
    } finally {
      if (timer) global.clearTimeout(timer);
    }
  }

  global.amfccBookLookup = {
    buildSearchUrl: buildSearchUrl,
    lookup: lookup,
    normalizeIsbn: normalizeIsbn,
    validIsbn10: validIsbn10,
    validIsbn13: validIsbn13
  };
})(typeof window !== "undefined" ? window : globalThis);
