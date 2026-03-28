export const stats = [
  { value: "40+", label: "Years shaping modern electric bass" },
  { value: "7", label: "Sequential Bass Mastery lesson books" },
  { value: "1977", label: "International breakthrough with Bruford" },
  { value: "NYC", label: "Queens-born, globally respected" }
];

export const careerMoments = [
  {
    year: "1953",
    title: "Queens origins",
    body: "Born Jeffrey Arthur Berlin in Queens, New York, then trained first on violin before turning to bass."
  },
  {
    year: "1970s",
    title: "Berklee to the world stage",
    body: "After study at Berklee, Berlin built his early profile through sessions and standout fusion work."
  },
  {
    year: "1977",
    title: "Bruford era",
    body: "Bill Bruford chose Berlin for Feels Good to Me, a move that placed him squarely in the global fusion spotlight."
  },
  {
    year: "Today",
    title: "Artist and educator",
    body: "Berlin continues recording, teaching, and championing a disciplined, reading-based approach to bass mastery."
  }
];

export const testimonials = [
  {
    name: "Zach Edd",
    quote:
      "Players with solid technique still report major gains from the reading packages because the neck knowledge becomes much more precise."
  },
  {
    name: "Kevin Gamble",
    quote:
      "Students consistently describe the material as practical, musical, and more useful than tab-driven online lessons."
  },
  {
    name: "Tom Mullarkey",
    quote:
      "Intermediate and long-time players alike praise the sequential structure and the way the etudes steadily raise the bar."
  }
];

export const footerLinks = [
  { label: "Bio", href: "/bio" },
  { label: "Music", href: "/music" },
  { label: "Lessons", href: "/lessons" },
  { label: "Store", href: "/store" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" }
];

export const books = [
  {
    id: "volume-one-pdf",
    title: "Jeff Berlin Bass Mastery Volume One",
    description:
      "A flagship PDF lesson volume focused on reading, fretboard command, and disciplined musical development.",
    price: 3995,
    priceLabel: "$39.95",
    format: "PDF Download",
    image: "/books/volume-one.png",
    checkoutImage: "/books/volume-one.png",
    width: 2500,
    height: 3235
  },
  {
    id: "complete-reading-course-pdf",
    title: "A Complete Reading Course For Beginners",
    description:
      "Jeff’s foundational reading course for bassists who want real fluency instead of pattern memorization.",
    price: 2995,
    priceLabel: "$29.95",
    format: "PDF Download",
    image: "/books/complete-reading-course.png",
    checkoutImage: "/books/complete-reading-course.png",
    width: 1600,
    height: 1600
  },
  {
    id: "book-two-pdf",
    title: "Book 2: Etudes in All Sharp and Flat Major Keys",
    description:
      "Advanced reading and key-center work designed to move the student beyond one-position comfort zones.",
    price: 2995,
    priceLabel: "$29.95",
    format: "PDF Download",
    image: "/books/book-two.png",
    checkoutImage: "/books/book-two.png",
    width: 1600,
    height: 1600
  },
  {
    id: "academic-walking-lines-pdf",
    title: "Book 6: Academic Walking Lines",
    description:
      "A deep dive into walking bass language with Jeff’s direct, no-nonsense approach to line construction.",
    price: 2995,
    priceLabel: "$29.95",
    format: "PDF Download",
    image: "/books/academic-walking-lines.png",
    checkoutImage: "/books/academic-walking-lines.png",
    width: 932,
    height: 1170
  }
];

export const booksById = Object.fromEntries(
  books.map((book) => [book.id, book])
);
