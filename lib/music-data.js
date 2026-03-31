function getReleaseKind(format = "") {
  const value = format.toLowerCase();

  if (value.includes("instructional")) return "instructional";
  if (value.includes("soundtrack")) return "soundtrack";
  if (value.includes("box set")) return "box-set";
  if (value.includes("best of")) return "best-of";
  if (value.includes("live")) return "live";
  if (value.includes("sampler")) return "sampler";
  if (value.includes("compilation")) return "compilation";
  if (value.includes("reissue")) return "reissue";
  if (value.includes("demo")) return "demo";
  if (value.includes("dvd")) return "instructional";

  return "album";
}

function getArtistFraming(artist, jeffRole) {
  if (artist.toLowerCase().includes("jeff berlin")) {
    return "This is a Jeff Berlin-led release rather than a sideman credit.";
  }

  if (jeffRole.toLowerCase().includes("track")) {
    return `Jeff appears on selected tracks within a release credited to ${artist}.`;
  }

  return `${artist} is the primary artist credit on this release.`;
}

function getKindLabel(kind, format) {
  switch (kind) {
    case "instructional":
      return "instructional release";
    case "soundtrack":
      return "soundtrack set";
    case "box-set":
      return "box set";
    case "best-of":
      return "best-of collection";
    case "live":
      return "live release";
    case "sampler":
      return "sampler";
    case "compilation":
      return "compilation";
    case "reissue":
      return "reissue package";
    case "demo":
      return "demo-era release";
    default:
      return format.toLowerCase();
  }
}

function getSpecificHook(title, artist, kind, jeffRole) {
  switch (kind) {
    case "instructional":
      return `${title} documents Jeff Berlin presenting his ideas directly, as both a performance artifact and a teaching statement.`;
    case "soundtrack":
      return `${title} places Jeff Berlin inside a soundtrack context rather than a conventional fusion or jazz release.`;
    case "box-set":
      return `${title} gathers material from different periods into one package and reframes the chronology around a larger set.`;
    case "best-of":
      return `${title} shows what material a catalog, label, or curator chose to carry forward in summary form.`;
    case "live":
      return `${title} shifts the angle from studio presentation to a live performance setting.`;
    case "sampler":
      return `${title} is a smaller-format release that shows where Jeff's name and playing surfaced in a scene snapshot.`;
    case "compilation":
      return `${title} collects Jeff's appearance into a larger anthology-style sequence.`;
    case "reissue":
      return `${title} shows how the material was repackaged and placed back into circulation.`;
    case "demo":
      return `${title} reflects demo-era process rather than only finished studio presentation.`;
    default:
      if (artist.toLowerCase().includes("jeff berlin")) {
        return `${title} is a direct Jeff Berlin release and adds another piece of his solo catalog.`;
      }

      if (jeffRole.toLowerCase().includes("track")) {
        return `${title} documents one of Jeff Berlin's narrower track-level appearances.`;
      }

      return `${title} is one of Jeff Berlin's documented sideman credits with ${artist}.`;
  }
}

function buildDiscographyCopy({ title, artist, year, format, jeffRole, coverSource, note }) {
  const kind = getReleaseKind(format);
  const formatLabel = getKindLabel(kind, format);
  const inferredRole =
    artist.toLowerCase().includes("jeff berlin") && jeffRole === "Credited appearance"
      ? kind === "instructional"
        ? "Instructor"
        : "Leader"
      : jeffRole;
  const roleLabel = inferredRole.toLowerCase();
  const noteLine = note || getSpecificHook(title, artist, kind, jeffRole);
  const artistLine = getArtistFraming(artist, jeffRole);

  return {
    intro: `${title} (${year}) is credited to ${artist}. Jeff Berlin is listed as ${roleLabel}.`,
    snapshot: [
      `${artist} issued ${title} in ${year} as a ${formatLabel}.`,
      `Jeff Berlin is credited on the release as ${roleLabel}.`,
      ...(coverSource ? [`Artwork on this page is sourced from ${coverSource}.`] : [])
    ],
    caseStudy: [noteLine, artistLine],
    highlights: [],
    trackMoments: []
  };
}

function makeDiscographyEntry({
  slug,
  title,
  artist,
  year,
  format = "Album",
  jeffRole = "Credited appearance",
  cover = null,
  coverSource = null,
  note,
  purchaseLink = null,
  sources,
  trackListing = [],
  personnel = [],
  technicalCredits = [],
  dedication = "",
  thanks = [],
  artworkNote = "",
  linerNotesNote = ""
}) {
  const generatedCopy = buildDiscographyCopy({
    title,
    artist,
    year,
    format,
    jeffRole,
    coverSource,
    note
  });

  return {
    slug,
    title,
    artist,
    year,
    format,
    jeffRole,
    cover: cover || `/music/credits/${slug}.jpg`,
    alt: cover ? `Cover art for ${artist}'s ${title}.` : "",
    cardBlurb:
      note ||
      `${title} is a ${year} ${format.toLowerCase()} by ${artist} with Jeff Berlin credited on the release.`,
    purchaseLink,
    trackListing,
    personnel,
    technicalCredits,
    dedication,
    thanks,
    artworkNote,
    linerNotesNote,
    intro: generatedCopy.intro,
    snapshot: generatedCopy.snapshot,
    caseStudy: generatedCopy.caseStudy,
    highlights: generatedCopy.highlights,
    trackMoments: generatedCopy.trackMoments,
    sources
  };
}

const featuredMusicAlbums = [
  {
    slug: "champion",
    title: "Champion",
    artist: "Jeff Berlin & Vox Humana",
    year: "1985",
    format: "Studio Album",
    jeffRole: "Leader, bass, writer",
    cover: "/music/solo/champion.jpg",
    alt: "Cover art for Jeff Berlin and Vox Humana's Champion.",
    cardBlurb:
      "Jeff Berlin's first solo statement arrives with serious firepower: Vox Humana, Scott Henderson, Steve Smith, and guest spots from Neil Peart.",
    intro:
      "Champion is the first real 'Jeff Berlin album' argument on this site. Not a sideman credit, not a guest appearance, but Jeff leading the record and writing most of the material.",
    snapshot: [
      "Released in 1985 and credited to Jeff Berlin & Vox Humana.",
      "Discogs lists Scott Henderson and Steve Smith throughout the album, with Neil Peart appearing on 'Marabi' and 'Champion (Of The World)'.",
      "The record mixes fusion instrumentals with more song-oriented material and vocals."
    ],
    caseStudy: [
      "What makes Champion important is that it shows Berlin building a band identity around his own writing instead of proving himself inside someone else's project.",
      "The personnel alone makes the record worth studying. Scott Henderson and Steve Smith give it a razor-sharp engine, and Neil Peart's guest appearances add another layer of historical interest.",
      "It also reveals how broad Jeff's instincts were in the mid-1980s. The album is not just about bass virtuosity. It moves between hard fusion, arranged material, and vocal-oriented tracks without apologizing for the range."
    ],
    purchaseLink: {
      provider: "eBay",
      href: "https://www.ebay.com/itm/286394586575"
    },
    highlights: [
      {
        title: "The solo-album starting gun",
        body: "This is the debut solo-era statement that makes Jeff Berlin the center of the frame."
      },
      {
        title: "Heavy personnel",
        body: "Discogs credits Scott Henderson, Steve Smith, and Neil Peart across the album's sessions."
      },
      {
        title: "More than a chops record",
        body: "Tracks like 'Subway Music' and 'Champion (Of The World)' show a broader songwriting ambition than a typical fusion workout."
      }
    ],
    trackMoments: [
      {
        title: "Mother Lode",
        body: "A strong opening statement for Jeff as bandleader and writer."
      },
      {
        title: "Marabi",
        body: "One of the tracks featuring Neil Peart, and a good example of the album's willingness to branch out arrangement-wise."
      },
      {
        title: "Champion (Of The World)",
        body: "The title track lands as the mission statement: bold, melodic, and built to stand up front."
      }
    ],
    sources: [
      {
        label: "Discogs master",
        href: "https://www.discogs.com/master/466185-Jeff-Berlin-Vox-Humana-4-Champion"
      },
      {
        label: "MusicBrainz",
        href: "https://musicbrainz.org/release-group/b19ecf3f-96cc-43cb-83e2-8875c55a376d"
      }
    ]
  },
  {
    slug: "pump-it",
    title: "Pump It!",
    artist: "Jeff Berlin",
    year: "1986",
    format: "Studio Album",
    jeffRole: "Leader, bass, writer",
    cover: "/music/solo/pump-it.jpg",
    alt: "Cover art for Jeff Berlin's Pump It!.",
    cardBlurb:
      "The follow-up is tighter, flashier, and more direct, with 'Joe Frazier (Round 2)' and Jeff's arrangement-heavy fusion writing pushed right to the front.",
    intro:
      "Pump It! feels like Jeff Berlin doubling down instead of easing off. The title alone tells you the record is not aiming for restraint.",
    snapshot: [
      "Released in 1986 as Jeff Berlin's follow-up to Champion.",
      "Discogs lists the track set including 'Pump It!', 'Joe Frazier (Round 2)', 'Crossroads', and 'Bach'.",
      "The album was issued on Passport Jazz and keeps Jeff fully in leader mode."
    ],
    caseStudy: [
      "This record captures the more aggressive side of Jeff's solo identity. It is still fusion, but it feels punchier and more audience-facing than some of the earlier ensemble records associated with his name.",
      "Even the track list tells you something. 'Joe Frazier (Round 2)' signals that Jeff was willing to revisit and sharpen earlier material instead of treating compositions like fixed museum pieces.",
      "It also works as a bridge record. Champion proved he could lead. Pump It! sounds like he knew it."
    ],
    purchaseLink: {
      provider: "eBay",
      href: "https://www.ebay.com/itm/397089735158"
    },
    highlights: [
      {
        title: "The follow-up with attitude",
        body: "This is a sequel record in the best sense: more confidence, less hesitation."
      },
      {
        title: "Revisiting key material",
        body: "Discogs identifies 'Joe Frazier (Round 2)' as a direct sequel to one of Jeff's signature pieces."
      },
      {
        title: "Arranger mindset",
        body: "The album's handling of material like 'Bach' and 'Crossroads' shows Jeff thinking beyond simple genre boxes."
      }
    ],
    trackMoments: [
      {
        title: "Pump It!",
        body: "The title track defines the record's personality fast."
      },
      {
        title: "Joe Frazier (Round 2)",
        body: "A central Jeff Berlin piece revisited with more muscle."
      },
      {
        title: "Manos De Piedra",
        body: "A good example of how Jeff balances technique with theatrical phrasing."
      }
    ],
    sources: [
      {
        label: "Discogs master",
        href: "https://www.discogs.com/master/466368-Jeff-Berlin-Pump-It"
      },
      {
        label: "MusicBrainz",
        href: "https://musicbrainz.org/release-group/f50fb958-701d-34c8-b94c-80813d0ed68c"
      }
    ]
  },
  {
    slug: "taking-notes",
    title: "Taking Notes",
    artist: "Jeff Berlin",
    year: "1997",
    format: "Studio Album",
    jeffRole: "Leader, bass",
    cover: "/music/solo/taking-notes.jpg",
    alt: "Cover art for Jeff Berlin's Taking Notes.",
    cardBlurb:
      "A late-1990s Jeff Berlin record that feels like a reset: cleaner production, sharper framing, and a title that says exactly what kind of musician he is.",
    intro:
      "Taking Notes is one of the easier Jeff Berlin titles to read symbolically. It sounds like a record made by a player who had already lived through the fusion spotlight years and was now framing his own catalog with more intention.",
    snapshot: [
      "Released on October 21, 1997 according to the Apple Music listing.",
      "Issued on Savoy Records with 10 tracks.",
      "It marks Jeff's return to a headline studio-album slot after the mid-1980s solo records."
    ],
    caseStudy: [
      "This album gives the solo catalog a second chapter. It is not the 1980s Jeff Berlin trying to announce himself anymore. It is a more seasoned Jeff shaping a record with the authority of somebody who already knows the stakes.",
      "The title also fits the broader Jeff Berlin story well. His reputation has always tied performance and musicianship together, and Taking Notes sounds like a record by someone who takes musical construction seriously at every level.",
      "It works as a pivot point between the early-fusion-solo era and the later records where Jeff's identity becomes even more self-defined."
    ],
    purchaseLink: {
      provider: "eBay",
      href: "https://www.ebay.com/itm/358081769064"
    },
    highlights: [
      {
        title: "A solo return",
        body: "After the first solo run, this record re-establishes Jeff in leader mode in the late 1990s."
      },
      {
        title: "Savoy-era framing",
        body: "The release ties Jeff's music to a label with real jazz history behind it."
      },
      {
        title: "A title that fits",
        body: "Few album titles line up this neatly with Jeff Berlin's reading-first musical philosophy."
      }
    ],
    trackMoments: [
      {
        title: "The album as a reset",
        body: "This is less about one famous signature tune and more about hearing Jeff present a new chapter cleanly."
      },
      {
        title: "Late-1990s tone",
        body: "The production frames Jeff in a more modern context than the Passport-era albums."
      },
      {
        title: "Leader-first perspective",
        body: "The value here is hearing Jeff set the terms of the whole record again."
      }
    ],
    sources: [
      {
        label: "Apple Music",
        href: "https://music.apple.com/us/album/taking-notes/1435637452"
      },
      {
        label: "AllMusic search result",
        href: "https://www.allmusic.com/search/albums/taking%20notes%20jeff%20berlin"
      }
    ]
  },
  {
    slug: "in-harmonys-way",
    title: "In Harmony's Way",
    artist: "Jeff Berlin",
    year: "2001",
    format: "Studio Album",
    jeffRole: "Leader, bass",
    cover: "/music/solo/in-harmonys-way.jpg",
    alt: "Cover art for Jeff Berlin's In Harmony's Way.",
    cardBlurb:
      "A 2001 Jeff Berlin record with a title that points straight at harmony and line construction, exactly the terrain he has spent decades defending as a player and teacher.",
    intro:
      "In Harmony's Way feels like one of the most Jeff Berlin album titles imaginable. Even before you hear a note, it suggests that the record is going to take musicianship seriously and organize itself around harmonic logic rather than flashy packaging.",
    snapshot: [
      "Released in 2001 according to Apple Music and Discogs.",
      "Discogs tags the album in a fusion and hard-bop lane.",
      "The original issue carries nine tracks."
    ],
    caseStudy: [
      "By the early 2000s, Jeff's solo catalog had a clearer throughline: melody, harmony, reading, and authority. In Harmony's Way sits right inside that identity.",
      "The album is worth highlighting because it sounds like Jeff leaning into the exact things that separate him from more pattern-based bass culture. The title is almost a manifesto.",
      "For this site, it also helps connect the player and the teacher. The same values that show up in his educational material are visible in the way he frames this record."
    ],
    purchaseLink: {
      provider: "eBay",
      href: "https://www.ebay.com/itm/187171472550"
    },
    highlights: [
      {
        title: "Title as thesis",
        body: "The name alone says a lot about what Jeff values musically."
      },
      {
        title: "Fusion with discipline",
        body: "Discogs places the album between fusion and hard bop rather than simple bass-showcase territory."
      },
      {
        title: "A mature solo phase",
        body: "This is Jeff in a more settled and self-aware solo-album mode."
      }
    ],
    trackMoments: [
      {
        title: "A harmony-first record",
        body: "Listen for how the album organizes itself around line, movement, and structure more than sheer density."
      },
      {
        title: "Bass as musical voice",
        body: "Jeff's phrasing stays melodic even when the writing gets more involved."
      },
      {
        title: "Teacher and artist aligned",
        body: "This album makes it easy to hear how Jeff's educational ideas come from actual musical choices."
      }
    ],
    sources: [
      {
        label: "Discogs master",
        href: "https://www.discogs.com/master/904653-Jeff-Berlin-In-Harmonys-Way"
      },
      {
        label: "Apple Music",
        href: "https://music.apple.com/us/album/in-harmonys-way/251268342"
      }
    ]
  },
  {
    slug: "lumpy-jazz",
    title: "Lumpy Jazz",
    artist: "Jeff Berlin",
    year: "2004",
    format: "Studio Album",
    jeffRole: "Leader, bass",
    cover: "/music/solo/lumpy-jazz.jpg",
    alt: "Cover art for Jeff Berlin's Lumpy Jazz.",
    cardBlurb:
      "One of Jeff Berlin's best album titles and one of his clearest signals that jazz doesn't need to be polished smooth to be musical.",
    intro:
      "Lumpy Jazz is a great Jeff Berlin title because it refuses elegance as marketing language. It implies contour, friction, personality, and maybe a sense of humor too.",
    snapshot: [
      "Released in 2004 according to Discogs, with Apple carrying the album in its catalog.",
      "The album contains nine tracks.",
      "Discogs lists it as a Jeff Berlin solo album rather than a group credit."
    ],
    caseStudy: [
      "This record hints at Jeff's contrarian streak. Even the title pushes back on the idea that jazz has to present itself as refined wallpaper.",
      "The solo discography gets more interesting once you see records like this next to titles like High Standards and Low Standards. Jeff clearly thinks in concepts, even when the concepts arrive with a wink.",
      "Lumpy Jazz shows Jeff still naming, framing, and shaping albums in a very personal way decades after the first solo records."
    ],
    highlights: [
      {
        title: "A memorable concept title",
        body: "The name alone gives the album personality before the music even starts."
      },
      {
        title: "Solo catalog depth",
        body: "This record shows Jeff's discography is broader and stranger than the standard fusion-summary version."
      },
      {
        title: "Not built for background use",
        body: "The framing suggests music with shape and edge rather than smooth-jazz anonymity."
      }
    ],
    trackMoments: [
      {
        title: "The title as clue",
        body: "Listen for the irregularity and bite implied by the album's name."
      },
      {
        title: "Mid-career confidence",
        body: "Jeff sounds like someone completely comfortable releasing a record under a title this specific."
      },
      {
        title: "Humor in the catalog",
        body: "This album is a reminder that Jeff's public musical identity has always included wit as well as rigor."
      }
    ],
    sources: [
      {
        label: "Discogs master",
        href: "https://www.discogs.com/master/892413-Jeff-Berlin-Lumpy-Jazz"
      },
      {
        label: "Apple Music",
        href: "https://music.apple.com/us/album/lumpy-jazz/255602022"
      }
    ]
  },
  {
    slug: "ace-of-bass",
    title: "Ace of Bass",
    artist: "Jeff Berlin",
    year: "2005",
    format: "Studio Album",
    jeffRole: "Leader, bass",
    cover: "/music/solo/ace-of-bass.jpg",
    alt: "Cover art for Jeff Berlin's Ace of Bass.",
    cardBlurb:
      "A 2005 Jeff Berlin solo album later linked by MusicBrainz to the Aneurythms release group, making it one of the most interesting entries in the catalog to compare across editions.",
    intro:
      "Ace of Bass is the kind of title only Jeff Berlin could probably get away with straight-faced. It lands somewhere between confidence, pun, and challenge.",
    snapshot: [
      "Discogs lists Ace of Bass as a 2005 Jeff Berlin album issued in Japan.",
      "MusicBrainz identifies the release group as the same body of work later issued as Aneurythms.",
      "The album carries 10 tracks including 'Porky & Beans', 'Saab Story', and 'Bass Boys'."
    ],
    caseStudy: [
      "This album opens a little discographic rabbit hole. MusicBrainz treats Ace of Bass and Aneurythms as the same release group, which makes the project interesting beyond the music itself.",
      "It shows Jeff's solo catalog has alternate-release history, not just a neat row of isolated records.",
      "Musically, the track names suggest a playful, self-aware Jeff Berlin record, which fits the broader pattern of him mixing serious musicianship with titles that keep things human."
    ],
    highlights: [
      {
        title: "A discography crossover point",
        body: "Ace of Bass and Aneurythms are linked at the release-group level in MusicBrainz."
      },
      {
        title: "Ten-track solo set",
        body: "Discogs lists a full 10-song program rather than a side project or EP."
      },
      {
        title: "Pure Jeff title energy",
        body: "The title lands as equal parts swagger and joke, which is exactly why it works."
      }
    ],
    trackMoments: [
      {
        title: "Porky & Beans",
        body: "A title that tells you immediately this record will not be humorless."
      },
      {
        title: "Saab Story",
        body: "Another reminder that Jeff's writing titles often have a specific private-world feel."
      },
      {
        title: "Bass Boys",
        body: "The closer reads almost like Jeff commenting on the scene from inside it."
      }
    ],
    sources: [
      {
        label: "Discogs master",
        href: "https://www.discogs.com/master/1106567-Jeff-Berlin-Ace-Of-Bass"
      },
      {
        label: "MusicBrainz release group",
        href: "https://musicbrainz.org/release-group/63976f82-f9b5-4d9d-9ec8-3ad6d4d4ced8"
      }
    ]
  },
  {
    slug: "aneurythms",
    title: "Aneurythms",
    artist: "Jeff Berlin",
    year: "2006",
    format: "Studio Album",
    jeffRole: "Leader, bass",
    cover: "/music/solo/aneurythms.jpg",
    alt: "Cover art for Jeff Berlin's Aneurythms.",
    cardBlurb:
      "The U.S. release of the Ace of Bass material, reframed under a different title and pushed deeper into Jeff Berlin's mid-2000s solo identity.",
    intro:
      "Aneurythms is one of the coolest titles in Jeff Berlin's catalog. It sounds cerebral, a little unstable, and very specifically his.",
    snapshot: [
      "Apple Music lists Aneurythms as a Jeff Berlin album released in 2006.",
      "MusicBrainz groups it with Ace of Bass as the same core release family.",
      "The program runs 10 tracks and includes material also associated with the Ace of Bass issue."
    ],
    caseStudy: [
      "The title, presentation, and market framing change the way the record reads in the catalog, even if the release group overlaps.",
      "Aneurythms feels more experimental as a title and more revealing as a statement of personality. It turns the project from a bass-language pun into something more abstract and slightly unhinged.",
      "Jeff Berlin's catalog is not just about notes and chops; it is also about how he frames the work and what kind of identity each release projects."
    ],
    highlights: [
      {
        title: "Alternate identity, same release family",
        body: "MusicBrainz links this album directly to the Ace of Bass release group."
      },
      {
        title: "A stronger conceptual title",
        body: "Aneurythms sounds more volatile and art-forward than the alternate title."
      },
      {
        title: "A mid-2000s Jeff document",
        body: "This is part of the run where Jeff's solo catalog becomes especially individual in tone and packaging."
      }
    ],
    trackMoments: [
      {
        title: "Compare against Ace of Bass",
        body: "The interesting move here is hearing the same project through a different title and presentation."
      },
      {
        title: "Mid-2000s writing voice",
        body: "The album captures Jeff when his solo catalog feels both playful and highly self-defined."
      },
      {
        title: "Concept through language",
        body: "Even before the music, the name does half the aesthetic work."
      }
    ],
    sources: [
      {
        label: "Apple Music",
        href: "https://music.apple.com/us/album/aneurythms/210453452"
      },
      {
        label: "MusicBrainz release group",
        href: "https://musicbrainz.org/release-group/63976f82-f9b5-4d9d-9ec8-3ad6d4d4ced8"
      }
    ]
  },
  {
    slug: "high-standards",
    title: "High Standards",
    artist: "Jeff Berlin",
    year: "2010",
    format: "Studio Album",
    jeffRole: "Leader, bass",
    cover: "/music/solo/high-standards.jpg",
    alt: "Cover art for Jeff Berlin's High Standards.",
    cardBlurb:
      "Jeff turns toward standards repertoire without softening his identity, making the title read as both genre marker and quality threshold.",
    intro:
      "High Standards is one of the cleanest title ideas in Jeff Berlin's catalog. It works literally as a standards record and metaphorically as a statement about musical expectations.",
    snapshot: [
      "Released in 2010 on M.A.J. Records according to Discogs and Apple Music.",
      "The album contains nine tracks.",
      "It begins a paired-title phase later answered by Low Standards."
    ],
    caseStudy: [
      "This is where Jeff Berlin's catalog gets especially elegant conceptually. High Standards tells you what the material is and what he expects from the music at the same time.",
      "The record shows Jeff did not need to hide behind fusion density to sound like himself. Standards material simply shifts the frame; it does not erase the personality.",
      "It also sets up a strong album pairing with Low Standards, turning the two records into a conversation across releases."
    ],
    highlights: [
      {
        title: "A perfect title",
        body: "It works as repertoire description and artistic philosophy in one phrase."
      },
      {
        title: "Standards through Jeff's lens",
        body: "The point is not neutrality. It is hearing Jeff apply his voice to familiar material."
      },
      {
        title: "Sets up the sequel",
        body: "Low Standards lands harder once you understand this album first."
      }
    ],
    trackMoments: [
      {
        title: "Listen for touch and phrasing",
        body: "The standards format makes Jeff's melodic instincts easier to isolate."
      },
      {
        title: "Compare to the fusion records",
        body: "This album shows what stays the same in Jeff's playing even when the repertoire changes."
      },
      {
        title: "The title as framework",
        body: "The phrase 'High Standards' tells you how to listen before the first note."
      }
    ],
    sources: [
      {
        label: "Discogs master",
        href: "https://www.discogs.com/Jeff-Berlin-High-Standards/master/1412557"
      },
      {
        label: "Apple Music",
        href: "https://music.apple.com/us/album/high-standards/372594385"
      }
    ]
  },
  {
    slug: "low-standards",
    title: "Low Standards",
    artist: "Jeff Berlin",
    year: "2013",
    format: "Studio Album",
    jeffRole: "Leader, bass",
    cover: "/music/solo/low-standards.jpg",
    alt: "Cover art for Jeff Berlin's Low Standards.",
    cardBlurb:
      "The title flips the earlier standards concept into something wryer and tougher, showing Jeff Berlin still playing with framing as much as repertoire.",
    intro:
      "Low Standards is the kind of title that reads like a sequel, a joke, a critique, and a mission statement all at once.",
    snapshot: [
      "Apple Music dates the album to 2013.",
      "The release contains eight tracks.",
      "It follows High Standards and works almost like a conceptual companion record."
    ],
    caseStudy: [
      "The obvious reason to feature Low Standards is the title relationship to High Standards. Jeff turns a simple phrase into a two-record concept and gives the catalog some real personality.",
      "It also reinforces how much of Jeff Berlin's public identity is built on standards in the broadest sense: musical standards, not just standards repertoire.",
      "The name sounds like a provocation, but the deeper point is still seriousness about music."
    ],
    highlights: [
      {
        title: "A companion-piece title",
        body: "This album instantly reads in relation to High Standards, which gives the catalog narrative shape."
      },
      {
        title: "Wit with teeth",
        body: "The phrase sounds funny until you realize it is also a criticism."
      },
      {
        title: "Late-career framing power",
        body: "Jeff is still finding strong conceptual hooks deep into the solo discography."
      }
    ],
    trackMoments: [
      {
        title: "Pair it with High Standards",
        body: "The real experience is hearing both records as a conversation."
      },
      {
        title: "Late-career Jeff voice",
        body: "The authority here is not youthful bravado. It is a veteran player choosing his angles precisely."
      },
      {
        title: "Title as critique",
        body: "The phrase shapes the whole listening experience before the music starts."
      }
    ],
    sources: [
      {
        label: "Apple Music",
        href: "https://music.apple.com/us/album/low-standards/1153301852"
      },
      {
        label: "AllMusic search result",
        href: "https://www.allmusic.com/search/albums/low%20standards%20jeff%20berlin"
      }
    ]
  },
  {
    slug: "jack-songs",
    title: "Jack Songs",
    artist: "Jeff Berlin",
    year: "2022",
    format: "Studio Album",
    jeffRole: "Leader, bass, concept",
    cover: "/music/solo/jack-songs.jpg",
    alt: "Cover art for Jeff Berlin's Jack Songs.",
    cardBlurb:
      "A late-career Jeff Berlin release built around Jack Bruce material, tying one of his lasting musical heroes back into his own catalog.",
    intro:
      "Jack Songs is one of the clearest late-period statements in Jeff Berlin's solo discography. It is personal, referential, and rooted in one of the foundational bass-and-song figures in Jeff's world: Jack Bruce.",
    snapshot: [
      "Released in 2022 according to Apple Music and Discogs.",
      "Discogs lists it as a Jeff Berlin album rather than a side-project credit.",
      "The record frames Jeff in direct conversation with Jack Bruce's songbook and influence."
    ],
    caseStudy: [
      "This album shows who still matters to Jeff Berlin after decades of playing, teaching, and recording. He is not just honoring a famous bassist. He is engaging with a songwriter and vocalist whose music shaped his own.",
      "That makes Jack Songs more than a tribute record. It is a late-career self-portrait through somebody else's material.",
      "It also brings the catalog full circle. The player who once emerged through fusion landmarks is now curating lineage, influence, and meaning on his own terms."
    ],
    highlights: [
      {
        title: "A direct tribute record",
        body: "Jeff centers the album around Jack Bruce, one of the major figures in electric bass history."
      },
      {
        title: "Late-career clarity",
        body: "The concept is focused, personal, and easy to read as a statement of influence."
      },
      {
        title: "Catalog closure and continuity",
        body: "It ties Jeff's present-day work back to the musical heroes that formed him."
      }
    ],
    trackMoments: [
      {
        title: "Listen for lineage",
        body: "The interesting tension is how Jeff honors Bruce without disappearing inside imitation."
      },
      {
        title: "A veteran's perspective",
        body: "This is Jeff Berlin choosing tribute material from the vantage point of a long, finished-in-public career."
      },
      {
        title: "Influence made explicit",
        body: "Unlike many records in the catalog, this one tells you directly who is being addressed."
      }
    ],
    sources: [
      {
        label: "Discogs master",
        href: "https://www.discogs.com/master/3226066-Jeff-Berlin-Jack-Songs"
      },
      {
        label: "Apple Music",
        href: "https://music.apple.com/us/album/jack-songs/1652252057"
      }
    ]
  },
  {
    slug: "feels-good-to-me",
    title: "Feels Good to Me",
    artist: "Bill Bruford",
    year: "1978",
    format: "Studio Album",
    jeffRole: "Bass",
    cover: "/music/feels-good-to-me.jpg",
    alt: "Cover art for Bill Bruford's Feels Good to Me.",
    cardBlurb:
      "The album that put Jeff Berlin into a serious fusion spotlight: Bruford, Holdsworth, Dave Stewart, Kenny Wheeler, and Berlin in one volatile debut statement.",
    intro:
      "This is one of the clearest origin points for Jeff Berlin's reputation in progressive fusion. Bill Bruford's first solo album became the launchpad for the Bruford band itself, and Berlin is right in the middle of a lineup that still looks absurd on paper.",
    snapshot: [
      "Feels Good to Me was released in January 1978 as Bill Bruford's first solo studio album, recorded in August 1977 at Trident Studios in London.",
      "The core lineup is Bill Bruford, Jeff Berlin, Allan Holdsworth, and Dave Stewart, with Kenny Wheeler on flugelhorn, Annette Peacock on vocals, and John Goodsall on rhythm guitar on the title track.",
      "The Bruford band grew directly out of the lineup assembled for this record, which is why the album reads like a beginning instead of a side project."
    ],
    caseStudy: [
      "This is one of the records that made Jeff Berlin unavoidable in fusion circles. Bruford did not build a polite all-star date; he put together a band of forceful players from different worlds and let the tension show in the writing.",
      "Jeff matters here because the music depends on precision without sounding stiff. Between Bruford's clipped attack, Holdsworth's harmonic drift, and Dave Stewart's dense keyboard writing, the bass has to stay articulate and aggressive all the way through.",
      "The guest list is not decorative either. Annette Peacock changes the shape of the album by pulling it toward song on key tracks, Kenny Wheeler adds a very different color on three pieces, and John Goodsall only appears once, which makes the title track feel even more specific."
    ],
    highlights: [
      {
        title: "A stacked lineup",
        body: "Bruford assembled musicians from Yes, King Crimson, the Canterbury scene, ECM, and Brand X orbit around one record."
      },
      {
        title: "Jeff in the deep end",
        body: "Berlin's bass work holds its own inside an ensemble that leaves no room for vague time or soft phrasing."
      },
      {
        title: "Bruford's next move",
        body: "The Bruford band effectively grows out of the lineup formed for this album."
      },
      {
        title: "Produced from inside the circle",
        body: "Robin Lumley co-produced the album with Bruford, tying the record even more tightly to the Brand X and late-1970s British fusion orbit."
      }
    ],
    trackMoments: [
      {
        title: "Beelzebub",
        body: "A natural entry point for the record's aggression and precision."
      },
      {
        title: "Feels Good to Me",
        body: "The title track shows how the album could move between fusion complexity and something more song-oriented."
      },
      {
        title: "Adios a la Pasada (Goodbye to the Past)",
        body: "The longer form writing gives the ensemble space to show how elastic the record really is."
      },
      {
        title: "Joe Frazier",
        body: "The 2005 remaster adds a live bonus performance of Jeff Berlin's composition 'Joe Frazier,' which is worth noting even though it was not part of the original LP."
      }
    ],
    trackListing: [
      "1. Beelzebub — 3:16",
      "2. Back to the Beginning — 7:09",
      "3. Seems Like a Lifetime Ago (Part One) — 2:30",
      "4. Seems Like a Lifetime Ago (Part Two) — 4:25",
      "5. Sample and Hold — 5:12",
      "6. Feels Good to Me — 3:49",
      "7. Either End of August — 5:27",
      "8. If You Can't Stand the Heat... — 3:20",
      "9. Springtime in Siberia — 2:43",
      "10. Adios a la Pasada (Goodbye to the Past) — 7:55"
    ],
    personnel: [
      "Bill Bruford: drums, percussion, vocals on track 2",
      "Allan Holdsworth: electric guitar",
      "Dave Stewart: keyboards",
      "Jeff Berlin: bass",
      "Kenny Wheeler: flugelhorn on tracks 3, 7, and 9",
      "Annette Peacock: lead vocals on tracks 2, 3, and 10",
      "John Goodsall: rhythm guitar on track 6"
    ],
    technicalCredits: [
      "Producer: Robin Lumley",
      "Producer: Bill Bruford",
      "Engineer: Stephen W Tayler",
      "Tape operator: John Brand",
      "Tape operator: Colin Green",
      "Tape operator: Stephen Short",
      "Equipment technician: Peter Revill",
      "Equipment technician: Mick Rossi",
      "Recorded at Trident Studios, London, in August 1977"
    ],
    sources: [
      {
        label: "Wikipedia",
        href: "https://en.wikipedia.org/wiki/Feels_Good_to_Me"
      },
      {
        label: "Discogs master",
        href: "https://www.discogs.com/master/456650-Bruford-Feels-Good-To-Me"
      },
      {
        label: "AllMusic review",
        href: "https://www.allmusic.com/album/feels-good-to-me-mw0000654005"
      },
      {
        label: "All About Jazz review",
        href: "https://www.allaboutjazz.com/bill-bruford-feels-good-to-me-and-one-of-a-kind-by-john-kelman"
      }
    ]
  },
  {
    slug: "one-of-a-kind",
    title: "One of a Kind",
    artist: "Bruford",
    year: "1979",
    format: "Studio Album",
    jeffRole: "Bass guitar",
    cover: "/music/one-of-a-kind.jpg",
    alt: "Cover art for Bruford's One of a Kind.",
    cardBlurb:
      "A sharper, more defined Bruford statement, with Jeff Berlin credited as writer on 'Five G' and the whole band sounding leaner and more dangerous.",
    intro:
      "If Feels Good to Me is the ignition point, One of a Kind is the sound of the band tightening the screws. The writing is more focused, the ensemble identity is stronger, and Jeff Berlin is now embedded in the group's DNA rather than appearing as a standout guest presence.",
    snapshot: [
      "Released in 1979 as the second Bruford studio album.",
      "Jeff Berlin is credited on bass and as a co-writer of 'Five G'.",
      "Wikipedia cites strong critical marks including 4.5 stars from AllMusic."
    ],
    caseStudy: [
      "This record shows Berlin as a compositional force inside advanced fusion, not only a virtuoso instrumentalist. His writing credit on 'Five G' shows how quickly he became central to the band's identity.",
      "The album also captures the balance that made this era work: complex enough for players to obsess over, but still direct enough to feel like a band record instead of a clinic.",
      "It shows Jeff Berlin inside an ensemble that was evolving fast and trusting him with more than bass chair duties."
    ],
    highlights: [
      {
        title: "Berlin in the writing",
        body: "Jeff Berlin shares writing credit on 'Five G', which says a lot about his role by this point."
      },
      {
        title: "Critically respected",
        body: "Wikipedia references strong reviews from AllMusic, DownBeat, and The Penguin Guide to Jazz."
      },
      {
        title: "Fusion with bite",
        body: "AllMusic's cited review frames it as fusion with a healthy dose of rock, which fits the album well."
      }
    ],
    trackMoments: [
      {
        title: "Five G",
        body: "The obvious Berlin focal point: co-written, muscular, and rhythmically alive."
      },
      {
        title: "The Abingdon Chasp",
        body: "Holdsworth's sole writing contribution gives the record one of its most famous pieces."
      },
      {
        title: "The Sahara of Snow",
        body: "A two-part closing statement that reinforces how cinematic this band could sound."
      }
    ],
    sources: [
      {
        label: "Wikipedia",
        href: "https://en.wikipedia.org/wiki/One_of_a_Kind_(Bruford_album)"
      },
      {
        label: "AllMusic review",
        href: "https://www.allmusic.com/album/r2830/review"
      }
    ]
  },
  {
    slug: "gradually-going-tornado",
    title: "Gradually Going Tornado",
    artist: "Bruford",
    year: "1980",
    format: "Studio Album",
    jeffRole: "Bass guitar, lead vocals",
    cover: "/music/gradually-going-tornado.jpg",
    alt: "Cover art for Bruford's Gradually Going Tornado.",
    cardBlurb:
      "The Bruford record where Jeff Berlin doesn't just play bass. He also sings, writes, and helps push the band closer to progressive rock without losing the technical heat.",
    intro:
      "Gradually Going Tornado is one of the most revealing Jeff Berlin credits in this whole run because it expands the job description. He is not only the bassist here. He is also singing lead and contributing writing in a band that was changing shape in real time.",
    snapshot: [
      "Released in 1980 as the final Bruford studio album.",
      "Jeff Berlin is credited with bass guitar and lead vocals.",
      "Jeff wrote 'Joe Frazier' and co-wrote 'The Sliding Floor'."
    ],
    caseStudy: [
      "The album leans further toward progressive rock than the earlier Bruford records, and that shift shows Berlin adapting without losing his precision or identity.",
      "The vocal role catches him in a wider frame and makes the record feel less like a strict fusion statement and more like a band stretching its boundaries.",
      "The Holdsworth departure is another key detail. John Clark takes over guitar duties after Holdsworth recommended him, which gives the album a different attack and helps define it as its own thing rather than a sequel."
    ],
    highlights: [
      {
        title: "Jeff sings",
        body: "This is the Bruford record where Berlin takes lead vocals, not just bass duties."
      },
      {
        title: "Original writing",
        body: "Jeff wrote 'Joe Frazier' and co-wrote 'The Sliding Floor', pushing deeper into the identity of the record."
      },
      {
        title: "A different guitar voice",
        body: "John Clark replaces Allan Holdsworth after Holdsworth recommended him for the job."
      }
    ],
    trackMoments: [
      {
        title: "Joe Frazier",
        body: "A Jeff Berlin composition and one of the most direct markers of his authorship in this catalog."
      },
      {
        title: "The Sliding Floor",
        body: "Co-written by Berlin, Bruford, and Dave Stewart, and a good example of the band's group chemistry."
      },
      {
        title: "Land's End",
        body: "The long-form closer shows the band's ambition and the broader progressive angle of the album."
      }
    ],
    sources: [
      {
        label: "Wikipedia",
        href: "https://en.wikipedia.org/wiki/Gradually_Going_Tornado"
      },
      {
        label: "AllMusic review",
        href: "https://www.allmusic.com/album/gradually-going-tornado-mw0000205407"
      }
    ]
  },
  {
    slug: "the-story-of-i",
    title: "The Story of I",
    artist: "Patrick Moraz",
    year: "1976",
    format: "Studio Album",
    jeffRole: "Bass",
    cover: "/music/story-of-i.jpg",
    alt: "Cover art for Patrick Moraz's The Story of I.",
    cardBlurb:
      "Patrick Moraz's 1976 solo debut is a 14-part concept album recorded between Switzerland and Rio, with Jeff Berlin, Alphonse Mouzon, Ray Gomez, and a deep Brazilian percussion frame.",
    intro:
      "The Story of I is one of the most distinctive albums anywhere near Jeff Berlin's 1970s orbit. Patrick Moraz built it as a single extended concept work, then recorded part of it in Rio de Janeiro with Brazilian percussion layered into the tracks, which gives the record a completely different pulse from the New York fusion sessions around it.",
    snapshot: [
      "Released in 1976, The Story of I was Patrick Moraz's first solo album after leaving Refugee and during his period with Yes.",
      "The album is structured as one continuous work divided into 14 titled sections and built around a concept involving a giant hotel-like building called 'The Story of i.'",
      "Recording took place at Aquarius Studios in Geneva and at a studio in Rio de Janeiro, where Moraz recorded much of the percussion that was later dubbed onto the album."
    ],
    caseStudy: [
      "This is not just a 'Patrick Moraz solo record with Jeff on bass.' It is a serious concept album with a clear narrative frame, a continuous-sequence structure, and a rhythmic identity shaped by Moraz's time in Brazil. That gives Jeff a very different job from the sharper jazz-funk records elsewhere in the discography.",
      "Jeff Berlin's playing matters here because the album needs movement, tension, and shape more than flashy isolated moments. The bass has to connect Moraz's keyboards, Ray Gomez's guitar, Alphonse Mouzon's drums, John McBurnie's vocals, and the Brazilian percussion overdubs into one flowing piece.",
      "It is also a historically useful record because it shows how broad Jeff's early discography really is. Within the same decade he is on Patti Austin, David Matthews, Bruford, and this. The Story of I proves he was never locked into one narrow fusion template."
    ],
    highlights: [
      {
        title: "A real concept album",
        body: "The Story of I is built as a single extended narrative work, divided into 14 sections rather than a conventional unrelated-song sequence."
      },
      {
        title: "Brazilian influence",
        body: "Moraz recorded much of the percussion in Rio de Janeiro and dubbed it onto the core tracks later, which gives the record its distinctive rhythmic identity."
      },
      {
        title: "Jeff outside the expected lane",
        body: "This is one of the clearest examples of Jeff Berlin working inside a progressive, textural, globally inflected studio album rather than a straight fusion blowing session."
      }
    ],
    trackMoments: [
      {
        title: "Impact to Intermezzo",
        body: "The opening run establishes the record fast: Moraz is not sequencing unrelated tunes, he is building one long-form environment."
      },
      {
        title: "Cachaça (Baião)",
        body: "This section makes the Brazilian rhythmic side of the album impossible to miss and shows how far the project sits from typical Anglo prog in 1976."
      },
      {
        title: "Best Years of Our Lives",
        body: "One of the clearest song-form focal points on the record, and a good place to hear how Jeff supports Moraz's melodic and vocal writing without breaking the album's larger flow."
      }
    ],
    trackListing: [
      "1. Impact",
      "2. Warmer Hands",
      "3. The Storm",
      "4. Cachaça (Baião)",
      "5. Intermezzo",
      "6. Indoors",
      "7. Best Years of Our Lives",
      "8. Descent",
      "9. Incantation",
      "10. Dancing Now",
      "11. Impressions (The Dream)",
      "12. Like a Child in Disguise",
      "13. Rise and Fall",
      "14. Symphony in the Space"
    ],
    personnel: [
      "Patrick Moraz: keyboards, vocals, percussion, story concept",
      "Jeff Berlin: bass guitar",
      "Alphonse Mouzon: drums",
      "Ray Gomez: guitar",
      "John McBurnie: vocals",
      "Vivienne McAuliffe: vocals",
      "Veronique Mueller: vocals",
      "Jean Ristori: cello",
      "Auguste De Anthony: acoustic guitar",
      "Jean-Luc Bourgeois: percussion",
      "Philippe Staehli: percussion",
      "Rene Moraz: dance"
    ],
    technicalCredits: [
      "Producer: Patrick Moraz",
      "Engineer: Jean Ristori",
      "Engineer: Chris Penycate",
      "Recorded at Aquarius Studios, Geneva, Switzerland",
      "Additional percussion recorded in Rio de Janeiro, Brazil and dubbed onto the album",
      "Label: Charisma",
      "Gatefold sleeve with lyrics/story material documented by contemporary LP listings"
    ],
    sources: [
      {
        label: "Wikipedia",
        href: "https://en.wikipedia.org/wiki/The_Story_of_I"
      },
      {
        label: "Apple Music",
        href: "https://music.apple.com/us/album/the-story-of-i/723354571"
      },
      {
        label: "MusicBrainz release",
        href: "https://musicbrainz.org/release/2e3e3cca-c7a2-4e7e-b8c4-bc4681149945/details"
      },
      {
        label: "EIL LP listing",
        href: "https://eil.com/shop/moreinfo.asp?catalogid=597166"
      },
      {
        label: "Shazam track credits",
        href: "https://www.shazam.com/song/723354763/best-years-of-our-lives"
      }
    ]
  },
  {
    slug: "road-games",
    title: "Road Games",
    artist: "Allan Holdsworth",
    year: "1983",
    format: "EP",
    jeffRole: "Bass",
    cover: "/music/road-games.jpg",
    alt: "Cover art for Allan Holdsworth's Road Games EP.",
    cardBlurb:
      "A compact Holdsworth release with Jeff Berlin on bass, Chad Wackerman on drums, Jack Bruce on vocals, and a Grammy nomination behind it.",
    intro:
      "Road Games is a short record, but not a small one. It captures Jeff Berlin working with Allan Holdsworth after their Bruford overlap and puts him inside an ensemble that also includes Chad Wackerman and Jack Bruce.",
    snapshot: [
      "Released in September 1983 through Warner Bros.",
      "Jeff Berlin plays bass alongside Allan Holdsworth and Chad Wackerman, with Jack Bruce singing on two tracks.",
      "The EP was nominated for Best Rock Instrumental Performance at the 1984 Grammy Awards."
    ],
    caseStudy: [
      "The cool part of Road Games is how concentrated it feels. There is no filler space. The personnel are heavy, the writing is condensed, and Berlin's role comes through fast.",
      "Wikipedia cites an AllMusic review that called it fusion-rock bliss and specifically praised Jeff's bass work. That matches the record's feel: technical, sharp, and still energetic enough to move like rock rather than a lab experiment.",
      "It also adds a useful angle to Jeff Berlin's profile because it shows his name attached to a release that crossed into a more broadly visible awards conversation."
    ],
    highlights: [
      {
        title: "Bruford-era overlap",
        body: "Holdsworth and Berlin reconnect here after their earlier work in Bruford's orbit."
      },
      {
        title: "Grammy-nominated",
        body: "The EP earned a nomination for Best Rock Instrumental Performance at the 1984 Grammys."
      },
      {
        title: "An elite rhythm section",
        body: "Berlin and Chad Wackerman give the record a fast, exact engine under Holdsworth's guitar work."
      }
    ],
    trackMoments: [
      {
        title: "Road Games",
        body: "The title track gives the record its most immediate vocal-forward statement."
      },
      {
        title: "Three Sheets to the Wind",
        body: "A tight instrumental entry point into the EP's balance of complexity and motion."
      },
      {
        title: "Material Real",
        body: "Jack Bruce's vocal appearance adds another layer of weight to the closing stretch."
      }
    ],
    sources: [
      {
        label: "Wikipedia",
        href: "https://en.wikipedia.org/wiki/Road_Games_(EP)"
      },
      {
        label: "AllMusic review",
        href: "https://www.allmusic.com/album/road-games-mw0000214996"
      }
    ]
  }
];

const discographyAlbums = [
  makeDiscographyEntry({
    slug: "end-of-a-rainbow",
    title: "End of a Rainbow",
    artist: "Patti Austin",
    year: "1976",
    format: "Studio Album",
    jeffRole: "Bass on tracks 2, 6, and 8",
    cardBlurb:
      "Patti Austin's CTI debut is a writer-heavy 1976 studio album with Jeff Berlin on three tracks, Creed Taylor producing, Bob James conducting, and Rudy Van Gelder handling part of the engineering chain.",
    intro:
      "End of a Rainbow is Patti Austin's debut album, and it matters because it catches her at the exact point where a gifted songwriter and singer stepped into the full CTI production world. Jeff Berlin is not on the whole record, but the tracks he does play are enough to make it a real discography stop rather than a token credit.",
    snapshot: [
      "Wikipedia identifies End of a Rainbow as Patti Austin's debut album, released in 1976 on CTI.",
      "The album runs nine tracks, eight written by Patti Austin and one outside cover: 'More Today Than Yesterday' by Pat Upton.",
      "Jeff Berlin is credited on tracks 2, 6, and 8, while Chuck Rainey and Will Lee handle the rest of the bass work across the album."
    ],
    caseStudy: [
      "This one is worth stopping for because it is not just 'early Patti Austin' and not just 'an early Jeff Berlin credit.' It is a polished CTI launch record with Patti writing almost the whole program herself, which immediately makes the album more personal than many label-driven debut sets from the period.",
      "Jeff's role is sharply defined. He appears on 'In My Life,' 'There Is No Time,' and 'This Side of Heaven,' so the record gives you another useful side-by-side comparison album where more than one elite bassist works inside the same session aesthetic.",
      "The supporting cast is loaded: Michael and Randy Brecker, Joe Farrell, Ronnie Cuber, Richard Tee, Barry Miles, Steve Gadd, Andy Newmark, Eric Gale, and Steve Khan all show up, with David Matthews arranging and Bob James conducting. That is a serious CTI-era room."
    ],
    highlights: [
      {
        title: "Patti wrote the album",
        body: "Eight of the nine songs are Patti Austin originals, which makes the record read as an artist statement instead of a generic debut package."
      },
      {
        title: "Three-bassist session split",
        body: "Jeff Berlin, Chuck Rainey, and Will Lee all appear on bass across the album, which gives the session unusual depth on the low end."
      },
      {
        title: "Lyrics on the sleeve",
        body: "Contemporary sleeve notes document that the album's lyrics were reprinted on the jacket, a small but telling sign of how much weight CTI gave Patti's writing."
      }
    ],
    trackMoments: [
      {
        title: "In My Life",
        body: "This is Jeff's first appearance on the album, with Steve Gadd, Richard Tee, Eric Gale, Joe Farrell, and David Matthews's arrangement frame around Patti."
      },
      {
        title: "There Is No Time",
        body: "Jeff returns here in a dense mid-album CTI setting that also brings in the Breckers, Ronnie Cuber, Barry Miles, and Ralph MacDonald."
      },
      {
        title: "This Side of Heaven",
        body: "Jeff's last track on the record lands late, which makes it easy to hear how his phrasing sits against the album's broader rotation of bass players."
      }
    ],
    trackListing: [
      "1. Say You Love Me — 5:45",
      "2. In My Life — 4:18",
      "3. You Don't Have to Say You're Sorry — 3:37",
      "4. More Today Than Yesterday — 5:29",
      "5. Give It Time — 3:07",
      "6. There Is No Time — 3:28",
      "7. What's at the End of a Rainbow — 2:50",
      "8. This Side of Heaven — 3:03",
      "9. Sweet Sadie the Savior — 6:25"
    ],
    personnel: [
      "Patti Austin: vocals",
      "Jeff Berlin: bass on tracks 2, 6, and 8",
      "Chuck Rainey: bass on tracks 1, 3, 4, and 5",
      "Will Lee: bass on tracks 7 and 9",
      "Steve Gadd: drums on tracks 2, 3, 4, and 9",
      "Andy Newmark: drums on tracks 1, 5, 6, 7, and 8",
      "Richard Tee: clavinet",
      "Michael Abene: piano",
      "Barry Miles: synthesizer",
      "Eric Gale: guitar",
      "Steve Khan: guitar",
      "Michael Brecker: tenor saxophone",
      "Joe Farrell: tenor saxophone",
      "Ronnie Cuber: baritone saxophone",
      "Randy Brecker: trumpet",
      "Ralph MacDonald: percussion"
    ],
    technicalCredits: [
      "Producer: Creed Taylor",
      "Arranged by David Matthews",
      "Conductor: Bob James",
      "Engineer: Joe Jorgensen",
      "Engineer: Alan Varner",
      "Engineer: Rudy Van Gelder on tracks 8 and 9",
      "Recorded at Mediasound, New York City, and Van Gelder Studio, Englewood Cliffs, New Jersey",
      "Recorded in April, May, and June 1976",
      "Cover photography: Pete Turner",
      "Liner photography: Jim Hadley",
      "Design: Rene Schumacher",
      "Lyrics reprinted on the sleeve"
    ],
    artworkNote:
      "The site cover image was upgraded from a 500x500 file to a larger 1405x1405 image using the same Apple Music cover art.",
    linerNotesNote:
      "The sleeve credits emphasize Patti Austin's songwriting by printing the lyrics on the jacket.",
    sources: [
      {
        label: "Discogs master",
        href: "https://www.discogs.com/master/136743-Patti-Austin-End-Of-A-Rainbow"
      },
      {
        label: "Patti Austin Wikipedia",
        href: "https://en.wikipedia.org/wiki/Patti_Austin"
      },
      {
        label: "Apple Music",
        href: "https://music.apple.com/us/album/end-of-a-rainbow/1128011050"
      },
      {
        label: "Muuseo sleeve-credit transcription",
        href: "https://muuseo.com/redlorry/items/206"
      },
      {
        label: "Pro-jazz track listing",
        href: "https://pro-jazz.com/audio/1976-patti-austin-end-of-a-rainbow-2013-cti-dsd64-107977.html"
      }
    ]
  }),
  makeDiscographyEntry({
    slug: "shoogie-wanna-boogie",
    title: "Shoogie Wanna Boogie",
    artist: "David Matthews With Whirlwind",
    year: "1976",
    format: "Studio Album",
    jeffRole: "Bass",
    cardBlurb:
      "A 1976 Kudu/CTI jazz-funk record where David Matthews turns Motown and pop material into big-band crossover tracks, with Jeff Berlin inside a room full of Breckers, Steve Khan, Don Grolnick, and Patti Austin.",
    intro:
      "Shoogie Wanna Boogie is David Matthews working the exact CTI/Kudu crossover zone that made the label so distinctive in the mid-1970s: big arrangements, heavy rhythm sections, pop-source material, and enough studio polish to push jazz-funk toward the dance floor without flattening it.",
    snapshot: [
      "The album was recorded in New York at A&R Recording and Mediasound on March 20-22 and April 17-20, 1976.",
      "It was produced by Creed Taylor and engineered by Joe Jorgensen, with assistant engineers Liz Saron and Matt Murray.",
      "The six-track program mixes original material with pop and soul covers including 'My Girl,' 'You Keep Me Hanging On,' 'California Dreaming,' and 'Just My Imagination (Running Away With Me)'."
    ],
    caseStudy: [
      "What makes this record useful for Jeff's discography is the environment. David Matthews was one of the core arranger-composers in the CTI orbit, so a credit here places Jeff inside a high-level crossover session culture rather than on a small-group blowing date.",
      "The personnel tell the story fast: Randy Brecker, Jon Faddis, Michael Brecker, Ronnie Cuber, Barry Miles, Don Grolnick, Steve Khan, Anthony Jackson, Andy Newmark, Sue Evans, Patti Austin, Vivian Cherry, and Gwen Guthrie all appear, with strings stacked on top. This is an arranged studio production built to sound large.",
      "It is also one of the more revealing mid-1970s Kudu records because the repertoire is so bluntly audience-facing. Matthews is not hiding behind abstract fusion titles. He is reshaping familiar songs into jazz-funk and disco-adjacent vehicles, which makes the album a strong period piece instead of a generic sideman credit."
    ],
    highlights: [
      {
        title: "Pure Kudu crossover",
        body: "The album sits right in the CTI/Kudu lane where jazz-funk, strings, horns, and pop-song reinterpretation all meet."
      },
      {
        title: "Studio heavyweights everywhere",
        body: "The ensemble includes the Breckers, Steve Khan, Don Grolnick, Barry Miles, Anthony Jackson, Andy Newmark, and Patti Austin among others."
      },
      {
        title: "Matthews as arranger",
        body: "David Matthews is not just the nominal artist here. The record makes sense as a statement of his arranging voice."
      }
    ],
    trackMoments: [
      {
        title: "You Keep Me Hanging On",
        body: "One of the clearest examples of the album's whole approach: familiar material turned into sharp, danceable Kudu jazz-funk."
      },
      {
        title: "California Dreaming",
        body: "Another strong marker for Matthews's crossover instinct, folding a pop standard into the album's string-and-horn architecture."
      },
      {
        title: "Just My Imagination",
        body: "The closing cover seals the point that this album is about reframing recognizable songs through a sophisticated studio ensemble."
      }
    ],
    trackListing: [
      "1. Shoogie Wanna Boogie — 5:38",
      "2. My Girl — 5:32",
      "3. You Keep Me Hanging On — 6:41",
      "4. California Dreaming — 6:26",
      "5. Gotta Be Where You Are — 6:58",
      "6. Just My Imagination (Running Away With Me) — 4:57"
    ],
    personnel: [
      "David Matthews: arrangements, direction",
      "Jeff Berlin: bass",
      "Anthony Jackson: electric bass",
      "Randy Brecker, Jon Faddis, Burt Collins, Alan Rubin, Joe Shepley: trumpet",
      "Sam Burtis, Tom Malone, Fred Wesley: trombone",
      "Dave Taylor: bass trombone",
      "Jim Buffington, Peter Gordon: French horn",
      "Joe Farrell: tenor saxophone, alto flute",
      "Michael Brecker: tenor saxophone",
      "Ronnie Cuber: baritone saxophone",
      "Pat Rebillot, Don Grolnick: clavinet",
      "Ken Ascher: clavinet, electric piano",
      "Barry Miles: synthesizer",
      "Jerry Friedman, Steve Khan, John Tropea: guitar",
      "Andy Newmark: drums",
      "Carlos Martin, Sue Evans, Nicky Marrero: percussion",
      "Patti Austin, Vivian Cherry, Gwen Guthrie: background vocals",
      "Harry Cykman, Max Ellen, Barry Finclair, Paul Gershman, Harry Glickman, Emanuel Green, Harold Kohon, Harry Lookofsky, David Nadien, Max Pollikoff, Matthew Raimondi, Richard Sortomme: violin",
      "Al Brown, Ted Israel: viola",
      "Seymour Barab, Jesse Levy, Charles McCracken, Alan Shulman: cello"
    ],
    technicalCredits: [
      "Producer: Creed Taylor",
      "Engineer: Joe Jorgensen",
      "Assistant engineers: Liz Saron, Matt Murray",
      "Recorded at A&R Recording and Mediasound, New York City",
      "Recording dates: March 20-22 and April 17-20, 1976",
      "Notes for later CD issues by Steve Futterman and Didier Deutsch",
      "Cover photo: Pete Turner",
      "Liner photos: Duane Michals",
      "Design: Rene Schumacher"
    ],
    sources: [
      {
        label: "Discogs master",
        href: "https://www.discogs.com/master/211273-David-Matthews-With-Whirlwind-Shoogie-Wanna-Boogie"
      },
      {
        label: "Doug Payne CTI discography",
        href: "https://www.dougpayne.com/ctid7576.htm"
      },
      {
        label: "Jazz資料館 personnel index",
        href: "https://jazzshiryokan.net/jazzDB/disc_detail.php?recordID=R10366"
      },
      {
        label: "AllMusic album page",
        href: "https://www.allmusic.com/album/shoogie-wanna-boogie-mw0000533937"
      },
      {
        label: "Apple Music",
        href: "https://music.apple.com/us/album/shoogie-wanna-boogie/1128011044"
      }
    ]
  }),
  makeDiscographyEntry({
    slug: "capricorn-princess",
    title: "Capricorn Princess",
    artist: "Esther Phillips",
    year: "1976",
    format: "Studio Album",
    jeffRole: "Bass on tracks 1, 3, 6, and 7",
    cardBlurb:
      "Esther Phillips's final Kudu album is a full CTI-era studio production with Jeff Berlin on four tracks, Creed Taylor producing, David Matthews arranging most of the record, and Rudy Van Gelder mixing and mastering.",
    intro:
      "Capricorn Princess is not a minor sideman footnote. It is Esther Phillips closing out her Kudu run with a polished 1976 studio album that sits on the line between soul, jazz, disco, and CTI-style production craft, and Jeff Berlin is on half the program.",
    snapshot: [
      "Wikipedia's Esther Phillips discography lists Capricorn Princess as a 1976 Kudu/CTI release that reached No. 150 on the Billboard 200, No. 23 on the jazz chart, and No. 40 on the R&B chart.",
      "Discogs-style session documentation credits Jeff Berlin on four tracks: 'Magic's in the Air,' 'Boy, I Really Tied One On,' '(Your Love Has Lifted Me) Higher & Higher,' and 'All the Way Down.'",
      "The production chain is fully documented: Creed Taylor produced, David Matthews arranged seven tracks, Pee Wee Ellis arranged 'Candy,' and Rudy Van Gelder mixed and mastered."
    ],
    caseStudy: [
      "The main reason this record matters is context. Esther Phillips was coming off her crossover success with 'What a Diff'rence a Day Makes,' and Capricorn Princess became her seventh and final album for Kudu before she moved to Mercury the next year. It is a closing statement for a label era, not a random catalog item.",
      "Jeff's role is specific and worth hearing in detail. He is not spread across the whole LP; he plays on four of the eight tracks, while Anthony Jackson handles the others. That split makes the album unusually useful for studying how different bass personalities sit inside the same larger production aesthetic.",
      "It also gives the page real historical weight beyond Jeff alone. Allan Holdsworth turns up on pedal steel guitar on 'Boy, I Really Tied One On,' the Brecker brothers and Jon Faddis appear in the horn charts, and the engineering path runs through Mediasound and Van Gelder Studio. This is a serious New York session record with names all over it."
    ],
    highlights: [
      {
        title: "Final Kudu album",
        body: "Presto's reissue notes and Esther Phillips's discography both place Capricorn Princess at the end of her Kudu run before the move to Mercury."
      },
      {
        title: "Jeff and Anthony on the same LP",
        body: "The bass chair is split between Jeff Berlin and Anthony Jackson, which gives the record a built-in point of comparison from track to track."
      },
      {
        title: "Van Gelder in the chain",
        body: "Rudy Van Gelder is credited for engineering, mixing, and mastering, which immediately raises the production interest level."
      }
    ],
    trackMoments: [
      {
        title: "Magic's in the Air",
        body: "Jeff opens the album with Andy Newmark, Don Grolnick, Barry Miles, Ronnie Cuber, Michael Brecker, Sam Burtis, Randy Brecker, Jon Faddis, and Ralph MacDonald behind Esther Phillips."
      },
      {
        title: "Boy, I Really Tied One On",
        body: "This is the oddball personnel favorite: Jeff on bass, Eric Gale on guitar, Bobby Lyle on clavinet, and Allan Holdsworth on pedal steel guitar."
      },
      {
        title: "All the Way Down",
        body: "Jeff's last track on the album pairs him with Andy Newmark, John Tropea, Don Grolnick, Hugh McCracken, Joe Farrell, Ronnie Cuber, and Ralph MacDonald on one of the record's longest cuts."
      }
    ],
    trackListing: [
      "1. Magic's in the Air — 2:56",
      "2. I Haven't Got Anything Better to Do — 3:41",
      "3. Boy, I Really Tied One On — 3:49",
      "4. Candy — 5:19",
      "5. A Beautiful Friendship — 2:55",
      "6. (Your Love Has Lifted Me) Higher & Higher — 3:57",
      "7. All the Way Down — 6:21",
      "8. Dream — 3:52"
    ],
    personnel: [
      "Esther Phillips: vocals",
      "Jeff Berlin: bass on tracks 1, 3, 6, and 7",
      "Anthony Jackson: bass on tracks 2, 4, 5, and 8",
      "Andy Newmark: drums on tracks 1, 3, 6, and 7",
      "Steve Gadd: drums on tracks 2, 4, 5, and 8",
      "Don Grolnick: organ and piano on track 1; organ on track 4; clavinet on tracks 6 and 7",
      "Michael Abene: piano on tracks 2, 5, and 8",
      "Barry Miles: synthesizer on tracks 1 and 8",
      "Bobby Lyle: clavinet on track 3",
      "John Tropea: guitar on tracks 1 and 7",
      "Eric Gale: guitar on tracks 3, 4, and 6",
      "Steve Khan: guitar on tracks 2, 5, and 8",
      "Allan Holdsworth: pedal steel guitar on track 3",
      "Hugh McCracken: harmonica on track 7",
      "Joe Farrell: flute and saxophone on track 7",
      "Ronnie Cuber: saxophone on tracks 1, 3, 6, and 7",
      "Michael Brecker: saxophone on tracks 1, 3, and 6",
      "Sam Burtis: trombone on tracks 1, 3, and 6",
      "Barry Rogers: trombone on tracks 4 and 8",
      "Randy Brecker: trumpet on tracks 1, 3, and 6",
      "Jon Faddis: trumpet on tracks 1, 3, and 6",
      "John Gatchell: trumpet on tracks 4 and 8",
      "Pee Wee Ellis: saxophone on tracks 4 and 8; arranger on track 4",
      "Ralph MacDonald: percussion on tracks 1, 3, 6, and 7",
      "Sue Evans: percussion on tracks 2 and 8",
      "John Blair: violin on track 2",
      "Babi Floyd, Frank Floyd, William Eaton, Zachary Sanders: background vocals",
      "Chuck Israels: bass in the additional ensemble credits",
      "Alfred Brown, Emanuel Vardi, Julien Barber, Lamar Alsop: viola",
      "Barry Finclair, David Nadien, Guy Lumia, Harold Kohon, Harry Lookofsky, Kathryn Kienke, Lewis Eley, Matthew Raimondi, Max Ellen, Max Pollikoff, Paul Gershman, Raoul Poliakin, Richard Sortomme: violin"
    ],
    technicalCredits: [
      "Producer: Creed Taylor",
      "Arranger: David Matthews on tracks 1, 2, 3, 5, 6, 7, and 8",
      "Arranger: Pee Wee Ellis on track 4",
      "Engineer: Alan Varner",
      "Engineer: Joe Jorgensen",
      "Engineer, mixing, mastering: Rudy Van Gelder",
      "Recorded at Mediasound and Van Gelder Studio, Englewood Cliffs, New Jersey",
      "All vocals recorded at Van Gelder Studio",
      "Recorded in May, July, and September 1976",
      "Design: Rene Schumacher",
      "Photography: Richard Alcorn",
      "Produced for CTI Records",
      "Copyright and phonographic copyright: Creed Taylor, Inc."
    ],
    artworkNote:
      "The site cover image was upgraded from a 600x600 file to a larger 1430x1430 image sourced from the Apple Music expanded-edition artwork, which uses the same front-cover design.",
    linerNotesNote:
      "The 2016 expanded edition is documented as including extensive notes by A. Scott Galloway.",
    sources: [
      {
        label: "Discogs master",
        href: "https://www.discogs.com/master/10879-Esther-Phillips-Capricorn-Princess"
      },
      {
        label: "Discogs release",
        href: "https://www.discogs.com/release/2312015-Esther-Phillips-Capricorn-Princess"
      },
      {
        label: "Wikipedia biography",
        href: "https://en.wikipedia.org/wiki/Esther_Phillips"
      },
      {
        label: "MusicBrainz release",
        href: "https://musicbrainz.org/release/d7d958ba-e392-4749-8d6a-89927bef0272"
      },
      {
        label: "Sessiondays credits index",
        href: "https://www.sessiondays.com/2023/08/1976-esther-phillips-capricorn-princess/"
      },
      {
        label: "Presto Music expanded edition notes",
        href: "https://www.prestomusic.com/jazz/products/8641969--capricorn-princess"
      }
    ]
  }),
  makeDiscographyEntry({
    slug: "lightn-up-please",
    title: "Light'n Up, Please!",
    artist: "David Liebman",
    year: "1977",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/211716-David-Liebman-Lightn-Up-Please" }
    ]
  }),
  makeDiscographyEntry({
    slug: "pure-as-rain",
    title: "Pure As Rain",
    artist: "Gil Goldstein",
    year: "1977",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/2259349-Gil-Goldstein-Pure-As-Rain" }
    ]
  }),
  makeDiscographyEntry({
    slug: "satanic",
    title: "Satanic",
    artist: "Ernie Krivda & Friends",
    year: "1977",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/1460524-Ernie-Krivda-Friends-Satanic" }
    ]
  }),
  makeDiscographyEntry({
    slug: "eye-of-the-beholder",
    title: "Eye of the Beholder",
    artist: "Ray Barretto",
    year: "1977",
    format: "Studio Album",
    jeffRole: "Bass on tracks 2, 7, and 8",
    cardBlurb:
      "A 1977 Ray Barretto Atlantic album that pushes Latin jazz into jazz-funk and fusion, with Jeff Berlin on three tracks and a split-session cast that includes Joe Sample, Wilton Felder, Steve Ferrone, and Terry Bozzio.",
    intro:
      "Eye of the Beholder is Ray Barretto in a crossover frame: still rooted in Latin rhythm, but clearly leaning into jazz-funk, fusion, and electric studio polish. That makes it a strong Jeff Berlin album credit because the bass has to work inside both groove language and arranged ensemble writing.",
    snapshot: [
      "Released in 1977 on Atlantic, Eye of the Beholder is Ray Barretto's 26th album and an eight-track studio record.",
      "Sessiondays credits Jeff Berlin on tracks 2, 7, and 8, while Wilton Felder plays bass on tracks 1, 3, 4, 5, and 6.",
      "The production is split between Crusaders members Joe Sample, Wilton Felder, and Stix Hooper, with engineering by Lew Hahn and Rik Pekkonen and mastering by Dennis King."
    ],
    caseStudy: [
      "What makes this album worth the time is the way it widens the Jeff Berlin picture. Ray Barretto is a giant in Afro-Cuban and Latin jazz, but Eye of the Beholder is not a straight salsa record. It is a late-1970s Atlantic studio album where Latin rhythm, fusion keyboards, and jazz-funk arranging all meet.",
      "Jeff's role is concentrated rather than album-wide. He appears on 'Senor Funk,' 'Leti,' and 'Tumbao Africano,' which is useful because those tracks let you hear him inside the more electric side of the record while Wilton Felder handles the rest of the program.",
      "It is also a very cast-specific session. Joe Sample and Gil Goldstein both show up on keys, Steve Ferrone handles drums on Jeff's tracks, Marcus Fiorillo and Ray Gomez split guitar duties, and the horn writing shifts from track to track. This is one of those albums where the personnel map is part of the story."
    ],
    highlights: [
      {
        title: "Barretto in fusion territory",
        body: "This is a Latin-jazz artist working in a late-1970s electric studio frame rather than on a purely traditional Afro-Cuban session."
      },
      {
        title: "Jeff and Wilton split the bass chair",
        body: "Jeff Berlin plays three tracks while Wilton Felder covers the other five, which makes the album unusually easy to compare from track to track."
      },
      {
        title: "Crusaders connection",
        body: "Joe Sample, Wilton Felder, and Stix Hooper all appear in the production frame, which says a lot about where Atlantic aimed this album."
      }
    ],
    trackMoments: [
      {
        title: "Senor Funk",
        body: "Jeff's first appearance on the album, with Steve Ferrone, Marcus Fiorillo, Joe Sample, and Gil Goldstein putting the record squarely into jazz-funk territory."
      },
      {
        title: "Leti",
        body: "One of Jeff's strongest spots on the record, with a roomy groove and a horn/percussion blend that keeps the Latin center intact."
      },
      {
        title: "Tumbao Africano",
        body: "Jeff's last track is also the most overtly percussion-driven one, with batá, timbales, and extra percussion pushing the Afro-Cuban side back to the front."
      }
    ],
    trackListing: [
      "1. Here We Go Again — 5:02",
      "2. Senor Funk — 4:43",
      "3. Eye of the Beholder — 4:24",
      "4. Salsa-Con-Fusion — 6:13",
      "5. Numero Uno — 4:48",
      "6. Expresso — 4:05",
      "7. Leti — 6:59",
      "8. Tumbao Africano — 4:34"
    ],
    personnel: [
      "Ray Barretto: congas, percussion",
      "Jeff Berlin: bass on tracks 2, 7, and 8",
      "Wilton Felder: bass on tracks 1, 3, 4, 5, and 6",
      "Steve Ferrone: drums on tracks 2, 7, and 8",
      "Terry Bozzio: drums on tracks 1, 3, 4, 5, and 6",
      "Joe Sample: keyboards on tracks 1, 2, 4, 5, and 7",
      "Gil Goldstein: keyboards on tracks 2, 3, 6, and 7",
      "Eddy Martinez: keyboards on track 8",
      "Clifford Carter: synthesizer on track 8",
      "Barry Finnerty: guitar on tracks 1 and 4",
      "Marcus Fiorillo: guitar on tracks 2 and 7",
      "Ray Gomez: guitar on track 8",
      "William Green and Pete Christlieb: saxophone on track 1",
      "Todd Anderson and Reynaldo Jorge: horns on tracks 2, 7, and 8",
      "Roger Rosenberg: saxophone on tracks 7 and 8",
      "Garnett Brown: trombone on track 1",
      "Luis Ortiz: trumpet on track 8",
      "Rafael Cruz: percussion on tracks 7 and 8",
      "Angel Maldonado and Ray Romero: batá on track 8",
      "Jimmy Delgado: timbales on track 8"
    ],
    technicalCredits: [
      "Producer: Stix Hooper",
      "Producer: Joe Sample",
      "Producer: Wilton Felder",
      "Coordinator: Raymond Silva",
      "Engineer: Lew Hahn on tracks 2, 3, 5, 6, 7, and 8",
      "Engineer: Rik Pekkonen on tracks 1 and 4",
      "Mastered by Dennis King",
      "Recorded at Atlantic Studios and Hollywood Sound Recorders",
      "Mastered at Atlantic Studios",
      "Art direction: Bob Defrin",
      "Photography: NASA"
    ],
    sources: [
      {
        label: "Discogs master",
        href: "https://www.discogs.com/master/288308-Barretto-Eye-Of-The-Beholder"
      },
      {
        label: "Sessiondays track credits",
        href: "https://www.sessiondays.com/2020/09/1977-ray-barretto-eye-of-the-beholder/"
      },
      {
        label: "Apple Music",
        href: "https://music.apple.com/us/album/eye-of-the-beholder/204707841"
      }
    ]
  }),
  makeDiscographyEntry({
    slug: "home-in-the-country",
    title: "Home In The Country",
    artist: "Pee Wee Ellis",
    year: "1977",
    format: "Studio Album",
    jeffRole: "Bass on five tracks",
    cardBlurb:
      "Pee Wee Ellis's first solo album is a deep New York jazz-funk session, and Jeff Berlin is on most of it alongside Idris Muhammad, Bernard Purdie, Roland Hanna, Eric Gale, George Benson, and Dave Liebman.",
    intro:
      "Home In The Country is more than a stray sideman credit. It is Pee Wee Ellis stepping out with his first solo album after years of shaping other people's records, and Jeff Berlin is part of the core band sound rather than a cameo.",
    snapshot: [
      "Discogs lists the album as a 1977 Savoy Records release in jazz-funk and fusion territory, with four known vinyl versions including a 1978 Spanish pressing.",
      "Jeff Berlin plays on five of the seven tracks: 'Nature Boy,' 'Big Daddy,' 'Kiss And Say Goodbye,' 'This Is Just A Warning!,' and 'Pistachio.'",
      "The personnel map is serious: Idris Muhammad, Bernard Purdie, Roland Hanna, Cornell Dupree, Eric Gale, George Benson, Leon Thomas, and Dave Liebman all appear on the session."
    ],
    caseStudy: [
      "The interesting part of this record is where it lands in Pee Wee Ellis's story. Wikipedia places Ellis as a major architect of James Brown's funk language and later a CTI and Kudu arranger; Home In The Country is the moment where that background turns into a front-of-the-cover Pee Wee Ellis album.",
      "Jeff's contribution is substantial. Discogs credits him on five tracks, while Anthony Jackson and Gordon Edwards handle the other two, so the record lets you hear Berlin inside a larger New York studio ecosystem without pretending he is the only bassist defining the date.",
      "That is what makes the album worth writing about. It is not generic fusion wallpaper. It is a bandleader record built from top-shelf players, with Ellis moving between funk discipline, jazz color, vocals, horns, and guest features, and Jeff right in the middle of that mix."
    ],
    highlights: [
      {
        title: "Pee Wee's first solo statement",
        body: "Wikipedia's discography identifies Home In The Country as Ellis's first solo album, which gives the session more weight than a routine catalog entry."
      },
      {
        title: "Jeff is on most of the album",
        body: "Discogs credits Berlin on five of seven tracks, making this a real working contribution, not a one-song guest spot."
      },
      {
        title: "A killer session cast",
        body: "The lineup pulls from elite 1970s jazz, funk, and studio circles: Idris Muhammad, Bernard Purdie, Roland Hanna, Eric Gale, George Benson, and Dave Liebman."
      }
    ],
    trackMoments: [
      {
        title: "Nature Boy",
        body: "Jeff opens the album with Idris Muhammad, Roland Hanna, and John Scholle behind Ellis, which immediately gives the record a more spacious, jazz-forward frame than a simple funk-blower date."
      },
      {
        title: "Big Daddy",
        body: "This is one of the densest ensemble cuts Jeff plays on, with Bernard Purdie, Cornell Dupree, Eric Gale, Barry Rogers, John Gatchell, Charlotte Crossley, and Leon Thomas all in the picture."
      },
      {
        title: "Pistachio",
        body: "The closer is a good reminder that Ellis was building a broader palette: Jeff's bass sits under a track that also brings in Dave Liebman and vocalist Eleana Sternberg."
      }
    ],
    trackListing: [
      "1. Nature Boy — 6:53",
      "2. Big Daddy — 5:20",
      "3. Gotcha! — 6:15",
      "4. Kiss And Say Goodbye — 3:59",
      "5. Fort Apache — 5:37",
      "6. This Is Just A Warning! — 6:26",
      "7. Pistachio — 4:27"
    ],
    personnel: [
      "Pee Wee Ellis: saxophone, clavinet, synthesizer, electric piano, organ, bell lyre, percussion, arrangements, conductor",
      "Jeff Berlin: bass on tracks 1, 2, 4, 6, and 7",
      "Anthony Jackson: bass on track 3",
      "Gordon Edwards: bass on track 5",
      "Idris Muhammad: drums on tracks 1, 6, and 7",
      "Bernard Purdie: drums on tracks 2, 3, and 5",
      "Jim Strassburg: drums and percussion",
      "Roland Hanna: electric piano on tracks 1, 4, 6, and 7",
      "Ernie Hayes: electric piano on tracks 2 and 5",
      "Jon Sholle: guitar on tracks 1, 4, 6, and 7",
      "Cornell Dupree: guitar on tracks 2 and 5",
      "Eric Gale: guitar on track 2 and guitar solo on track 5",
      "Charlie Brown: guitar on tracks 3 and 4",
      "George Benson: guitar solo on track 3",
      "Barry Rogers: trombone on tracks 2 and 4",
      "John Gatchell: trumpet on tracks 2 and 4",
      "Waymon Reed: trumpet on track 6",
      "David Liebman: saxophone on track 7",
      "Jumma Santos: congas and percussion",
      "Ray Mantilla: shaker on track 2 and percussion on track 4",
      "Babatunde Olatunji: congas on track 3",
      "Charlotte Crossley: vocals on tracks 2 and 6",
      "Leon Thomas: vocals on tracks 2 and 6",
      "Lani Groves: background vocals on tracks 2 to 4 and vocals on track 6",
      "Lilian Tynes: background vocals on tracks 2 to 4 and vocals on track 6",
      "Vivian Cherry: background vocals on tracks 3 and 4",
      "Dwain Jones: vocals on track 6",
      "Melanie Jordin: vocals on track 6",
      "Eleana Sternberg: vocals on track 7"
    ],
    technicalCredits: [
      "Producer: Bob Porter",
      "Producer: Pee Wee Ellis",
      "Executive producer: Steve Backer",
      "Arranged by: Pee Wee Ellis",
      "Conductor: Pee Wee Ellis",
      "Engineer: Kevin Herron",
      "Engineer: Skip Juried",
      "Mixed by: Kevin Herron",
      "Recorded by: Skip Juried",
      "Mixed at The Hit Factory",
      "Recorded at Sound Exchange Studios",
      "Art direction: Robert Heimall",
      "Photography: Benno Friedman",
      "Typography: Hal Fiedler"
    ],
    sources: [
      {
        label: "Discogs release",
        href: "https://www.discogs.com/release/2077371-Pee-Wee-Ellis-Home-In-The-Country"
      },
      {
        label: "Wikipedia biography",
        href: "https://en.wikipedia.org/wiki/Pee_Wee_Ellis"
      },
      {
        label: "Sessiondays credits",
        href: "https://sessiondays.com/2021/07/14/1977-pee-wee-ellis-home-in-a-country/"
      }
    ]
  }),
  makeDiscographyEntry({
    slug: "mixed-roots",
    title: "Mixed Roots",
    artist: "Al Foster",
    year: "1978",
    format: "Studio Album",
    jeffRole: "Bass on tracks 1 and 2",
    cardBlurb:
      "Al Foster's 1978 leader date is a tight electric-jazz record produced by Teo Macero, with Jeff Berlin on the opening two tracks and a cast that includes Michael Brecker, Bob Mintzer, Masabumi Kikuchi, and T.M. Stevens.",
    intro:
      "Mixed Roots is Al Foster stepping into leader territory with a record that still carries some Miles-adjacent DNA. The Teo Macero production credit matters immediately, but so does the personnel split: Jeff Berlin opens the album, then the bass chair rotates to T.M. Stevens and Ron McClure as the session changes shape.",
    snapshot: [
      "Released in 1978, Mixed Roots is a seven-track studio album recorded at CBS Studios in New York.",
      "Jeff Berlin plays bass on 'Mixed Roots' and 'Ya'Damn Right', while T.M. Stevens takes tracks 3 through 6 and Ron McClure plays the closer.",
      "Teo Macero produced the album, Frank Laico handled the original recording, and Russ Payne is credited for the remix."
    ],
    caseStudy: [
      "This album matters because it puts Jeff inside a drummer-led record with a very specific late-1970s electric-jazz identity. Al Foster is not just any bandleader here; he is one of the defining drummers from Miles Davis's electric period, and Mixed Roots sounds like somebody translating that energy into his own session.",
      "Jeff's contribution is concentrated but important. He is on the first two tracks, which means the opening impression of the album is partially his. That makes Mixed Roots another good comparison record: Jeff starts the program, then the session pivots to T.M. Stevens and finally Ron McClure.",
      "The rest of the room is strong enough to keep the record from drifting into generic fusion. Michael Brecker is all over it, Bob Mintzer and Sam Morrison appear on soprano, Masabumi Kikuchi handles most of the keyboards, and Paul Metzke's guitar gives the record an edge that fits Foster's drumming."
    ],
    highlights: [
      {
        title: "Teo Macero production",
        body: "Macero's name ties the record directly to the larger Miles electric-world lineage around Al Foster."
      },
      {
        title: "Jeff opens the album",
        body: "Berlin plays the first two tracks, which means the record's opening sound is partly built on his bass work."
      },
      {
        title: "A dedication to Miles",
        body: "'Dr. Jekyll & Mr. Hyde' is dedicated to Miles Davis and should be treated that way in the liner notes."
      }
    ],
    trackMoments: [
      {
        title: "Mixed Roots",
        body: "Jeff's first track on the album comes with Bob Mintzer, Michael Brecker, Masabumi Kikuchi, Paul Metzke, and Foster, which sets the electric-jazz frame fast."
      },
      {
        title: "Ya'Damn Right",
        body: "Jeff's second and final track is darker and more driving, and it is the clearest place to hear him anchor Foster's concept before the bass chair changes."
      },
      {
        title: "Dr. Jekyll & Mr. Hyde",
        body: "The Miles dedication matters. It makes the track more than a title; it turns it into an explicit nod toward the musical world Foster came out of."
      }
    ],
    trackListing: [
      "1. Mixed Roots — 6:56",
      "2. Ya'Damn Right — 5:29",
      "3. Pauletta — 6:28",
      "4. Double Stuff — 7:51",
      "5. Dr. Jekyll & Mr. Hyde — 7:47",
      "6. El Cielo Verde — 4:28",
      "7. Soft Distant — 7:08"
    ],
    personnel: [
      "Al Foster: drums, piano on track 4",
      "Jeff Berlin: electric bass on tracks 1 and 2",
      "T.M. Stevens: electric bass on tracks 3 to 6",
      "Ron McClure: acoustic bass on track 7",
      "Masabumi Kikuchi: piano on tracks 1 to 6",
      "Teo Macero: piano on track 7",
      "Paul Metzke: guitar on tracks 1 to 3 and 5 to 7",
      "Michael Brecker: tenor saxophone on tracks 1, 2, 4, 5, and 7; soprano saxophone on tracks 3 and 6",
      "Bob Mintzer: soprano saxophone on tracks 1 and 2",
      "Sam Morrison: soprano saxophone on tracks 5 and 6",
      "Jim Clouse: flute on track 3; alto saxophone on track 5"
    ],
    technicalCredits: [
      "Producer: Teo Macero",
      "Recording engineer: Frank Laico",
      "Remix engineer: Russ Payne",
      "Recorded at CBS Studios, New York City",
      "Cover art design: Teruhisa Tajima on the documented reissue",
      "Back-cover photography: Shigeo Anzai on the documented reissue"
    ],
    dedication:
      "\"Dr. Jekyll & Mr. Hyde\" is dedicated to Miles Davis.",
    sources: [
      {
        label: "Discogs master",
        href: "https://www.discogs.com/master/289214-Al-Foster-Mixed-Roots"
      },
      {
        label: "Jazzdisco Al Foster catalog",
        href: "https://www.jazzdisco.org/al-foster/catalog/"
      },
      {
        label: "Record City reissue credits",
        href: "https://www.recordcity.jp/es/catalog/645862"
      },
      {
        label: "K's Jazz Days notes",
        href: "https://dailymusiclog.hatenablog.com/entry/2018/02/15/083342"
      }
    ]
  }),
  makeDiscographyEntry({
    slug: "montreux-concert",
    title: "Montreux Concert",
    artist: "Don Pullen",
    year: "1978",
    format: "Live Album",
    jeffRole: "Electric bass",
    cardBlurb:
      "A live 1977 Montreux document with Don Pullen, Jeff Berlin, Steve Jordan, and added percussion on the second side, produced by Herbie Mann and Ilhan Mimaroglu for Atlantic.",
    intro:
      "Montreux Concert is a compact but important Jeff Berlin credit because it strips the setting down to a live Don Pullen group and lets the improvising do the work. There are only two long performances here, which means every player is exposed.",
    snapshot: [
      "The album was recorded live at the Montreux International Festival in Switzerland on July 12, 1977 and released by Atlantic in 1978.",
      "The program contains only two extended tracks: 'Richard's Tune' and 'Dialogue Between Malcolm and Betty'.",
      "Jeff Berlin plays electric bass throughout, with Steve Jordan on drums and Raphael Cruz and Sammy Figueroa added on percussion for the second performance."
    ],
    caseStudy: [
      "This record matters because it shows Jeff in a very different frame from the arranged studio albums around it. Don Pullen is not asking for polish or crossover gloss here. The music is live, long-form, and open enough that every rhythmic and harmonic decision counts.",
      "The dedication on 'Richard's Tune' matters too. The piece is dedicated to Muhal Richard Abrams, which places the album inside a much more serious modern-jazz lineage than a casual festival blowout would suggest.",
      "It is also a useful Jeff Berlin document because there is nowhere to hide. With only piano, bass, drums, and later percussion, you hear exactly how he responds to Pullen's inside-outside language and Steve Jordan's drumming in real time."
    ],
    highlights: [
      {
        title: "Live and exposed",
        body: "Only two long tracks, recorded live, which makes the bass role much easier to study than on an arranged studio date."
      },
      {
        title: "Dedicated to Muhal Richard Abrams",
        body: "'Richard's Tune' explicitly carries the Abrams dedication and should be treated as an intentional statement, not a throwaway title."
      },
      {
        title: "Atlantic-era Don Pullen",
        body: "This is part of Pullen's short but important Atlantic period, which briefly put him into a larger-label frame."
      }
    ],
    trackMoments: [
      {
        title: "Richard's Tune",
        body: "An 18-minute opening performance dedicated to Muhal Richard Abrams, with Jeff and Steve Jordan handling the trio setting without extra percussion."
      },
      {
        title: "Dialogue Between Malcolm and Betty",
        body: "The second side expands the sound by adding Raphael Cruz and Sammy Figueroa on percussion, which changes the rhythmic shape without reducing the openness."
      }
    ],
    trackListing: [
      "1. Richard's Tune (Dedicated to Muhal Richard Abrams) — 18:10",
      "2. Dialogue Between Malcolm and Betty — 21:47"
    ],
    personnel: [
      "Don Pullen: piano",
      "Jeff Berlin: electric bass",
      "Steve Jordan: drums",
      "Raphael Cruz: percussion on track 2",
      "Sammy Figueroa: percussion on track 2"
    ],
    technicalCredits: [
      "Producer: Herbie Mann",
      "Producer: Ilhan Mimaroglu",
      "Recording engineer: John Timperley",
      "Recording engineer assistant: David Richards",
      "Mixing engineer: Bobby Warner",
      "Mastering engineer: George Piros",
      "Mixed and mastered at Atlantic Recording Studios, New York",
      "Cover illustration: Don Brautigam",
      "Cover design: Sandi Young",
      "Liner photography: Giuseppe Pino"
    ],
    dedication:
      "\"Richard's Tune\" is dedicated to Muhal Richard Abrams.",
    sources: [
      {
        label: "Discogs master",
        href: "https://www.discogs.com/master/528976-Don-Pullen-Montreux-Concert"
      },
      {
        label: "Wikipedia",
        href: "https://en.wikipedia.org/wiki/Montreux_Concert"
      },
      {
        label: "High Fidelity LA release notes",
        href: "https://highfidelityla.com/release/9080481/don-pullen-montreux-concert"
      }
    ]
  }),
  makeDiscographyEntry({
    slug: "street-talk",
    title: "Street Talk",
    artist: "Karl Ratzer",
    year: "1979",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/1064286-Karl-Ratzer-Street-Talk" }
    ]
  }),
  makeDiscographyEntry({
    slug: "the-bruford-tapes",
    title: "The Bruford Tapes",
    artist: "Bruford",
    year: "1979",
    format: "Live Album",
    jeffRole: "Bass guitar",
    cover: "/music/credits/the-bruford-tapes.jpg",
    coverSource: "Apple Music",
    cardBlurb:
      "A radio-broadcast live Bruford album from Roslyn, New York, with Jeff Berlin, Dave Stewart, Bill Bruford, and John Clark stepping into Allan Holdsworth's former chair.",
    intro:
      "The Bruford Tapes matters because it is not a polished concert album built in post. It is a WLIR broadcast document from My Father's Place in Roslyn, cut from a touring lineup that had just changed guitarists and still had to deliver hard material from the first two Bruford records.",
    snapshot: [
      "The album was recorded on July 12, 1979 at My Father's Place in Roslyn, New York, and originally broadcast on WLIR-FM 92.7.",
      "Shortly before the tour, Allan Holdsworth left and was replaced by John Clark, credited on the sleeve as 'the unknown John Clark.'",
      "The program reshuffles material from Feels Good to Me and One of a Kind into a lean nine-track live set."
    ],
    caseStudy: [
      "This is one of the clearest records for hearing Jeff Berlin in the Bruford band as a working live unit rather than an assembled studio project. The music is tighter, riskier, and less protected than it is on the studio albums because the broadcast setup leaves the edges exposed.",
      "John Clark's presence is part of what makes the record interesting. Holdsworth's departure could have made the band sound compromised, but The Bruford Tapes instead catches a group adjusting in public and still sounding dangerous.",
      "Jeff is central to that success. The set leans on the rhythmic snap of his bass against Bruford's drumming and Dave Stewart's keyboard writing, especially on 'Sample And Hold,' 'Fainting In Coils,' and the closing '5g,' which keeps his co-writing credit visible on a live Bruford release."
    ],
    highlights: [
      {
        title: "A live lineup under pressure",
        body: "The group had just replaced Allan Holdsworth with John Clark, so the album captures a real transition rather than a settled long-running band."
      },
      {
        title: "Broadcast, not beautified",
        body: "The sleeve notes stress that the set was broadcast live from My Father's Place and recorded direct to 2-track for radio, which is a very different proposition from a heavily overdubbed concert record."
      },
      {
        title: "Jeff's writing credit survives live",
        body: "The closer '5g' still carries Jeff Berlin's co-writing credit, which matters on a record otherwise built from Bruford and Stewart material."
      }
    ],
    trackMoments: [
      {
        title: "Sample And Hold",
        body: "One of the best examples of how the live band hardens the studio arrangement without losing the rhythmic detail."
      },
      {
        title: "Fainting In Coils",
        body: "A good study track for the band's live interaction, especially the bass and keyboard movement under the guitar lines."
      },
      {
        title: "5g",
        body: "The closing sprint keeps Jeff's co-writing credit in view and ends the album with one of the sharpest rhythmic performances in the set."
      }
    ],
    trackListing: [
      "1. Hells Bells — 4:02",
      "2. Sample And Hold — 6:18",
      "3. Fainting In Coils — 6:34",
      "4. Travels With Myself - And Someone Else — 4:37",
      "5. Beelzebub — 3:28",
      "6. The Sahara Of Snow (Part One) — 4:46",
      "7. The Sahara Of Snow (Part Two) — 3:07",
      "8. One Of A Kind (Part Two) — 8:06",
      "9. 5g — 2:39"
    ],
    personnel: [
      "Bill Bruford: drums and percussion",
      "Dave Stewart: electric piano, synthesizer, electronics",
      "Jeff Berlin: bass guitar",
      "John Clark: electric guitar"
    ],
    technicalCredits: [
      "Technical director: Michael Billeter",
      "Recorded by: Jeff Kracke",
      "Front cover credit: Jean Kelly",
      "Photography: Neil Zlozower",
      "Broadcast live from My Father's Place, Roslyn, New York on WLIR-FM 92.7 on July 12, 1979",
      "Recorded direct to 2-track and mixed for broadcast by Jeff Kracke at Workshoppe Recording Studios"
    ],
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/230496-Bruford-The-Bruford-Tapes" },
      { label: "Wikipedia", href: "https://en.wikipedia.org/wiki/The_Bruford_Tapes" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/the-bruford-tapes-live/714555077" },
      { label: "Calyx Canterbury discography", href: "https://calyx-canterbury.fr/cantdisco/B.html" }
    ]
  }),
  makeDiscographyEntry({
    slug: "just-as-i-thought",
    title: "Just As I Thought",
    artist: "David Sancious",
    year: "1979",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/370409-David-Sancious-Just-As-I-Thought" }
    ]
  }),
  makeDiscographyEntry({
    slug: "lifelike",
    title: "Lifelike",
    artist: "Klaus Doldinger + Passport",
    year: "1980",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/195970-Klaus-Doldinger-Passport-Lifelike" }
    ]
  }),
  makeDiscographyEntry({
    slug: "leave-that-boy-alone",
    title: "Leave That Boy Alone!",
    artist: "Poussez!",
    year: "1980",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/151255-Poussez-Leave-That-Boy-Alone" }
    ]
  }),
  makeDiscographyEntry({
    slug: "twentieth-century-impressions",
    title: "20th Century Impressions",
    artist: "Joe Diorio, Jeff Berlin, Vin Colaiuta",
    year: "1981",
    note:
      "A trio record that puts Jeff Berlin in a small-group setting alongside Joe Diorio and Vin Colaiuta.",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/1075648-Joe-Diorio-Jeff-Berlin-Vin-Colaiuta-20th-Century-Impressions" }
    ]
  }),
  makeDiscographyEntry({
    slug: "mellow",
    title: "Mellow",
    artist: "Herbie Mann",
    year: "1981",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/642822-Herbie-Mann-Mellow" }
    ]
  }),
  makeDiscographyEntry({
    slug: "tvaer-systur",
    title: "Tvær Systur",
    artist: "Jakob Magnússon",
    year: "1982",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/6132257-Jakob-Magn%C3%BAsson-Tv%C3%A6r-Systur" }
    ]
  }),
  makeDiscographyEntry({
    slug: "crazy-bird",
    title: "Crazy Bird",
    artist: "Clare Fischer & Salsa Picante",
    year: "1985",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/1413237-Clare-Fischer-Salsa-Picante-Crazy-Bird" }
    ]
  }),
  makeDiscographyEntry({
    slug: "storytime",
    title: "Storytime",
    artist: "T Lavitz",
    year: "1986",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/594964-T-Lavitz-Storytime" }
    ]
  }),
  makeDiscographyEntry({
    slug: "master-strokes-1978-1985",
    title: "Master Strokes 1978-1985",
    artist: "Bill Bruford",
    year: "1986",
    cover: "/music/credits/master-strokes.jpg",
    coverSource: "Apple Music",
    note:
      "A Bill Bruford compilation explicitly framed around the Jeff Berlin and Allan Holdsworth era.",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/261663-Bill-Bruford-Master-Strokes-1978-1985" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/master-strokes-1978-1985-feat-allan-holdsworth-jeff-berlin/724167499" }
    ]
  }),
  makeDiscographyEntry({
    slug: "timezone",
    title: "Timezone",
    artist: "Jakob Magnússon",
    year: "1986",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/894531-Jakob-Magnusson-Timezone" }
    ]
  }),
  makeDiscographyEntry({
    slug: "players",
    title: "Players",
    artist: "Players",
    year: "1987",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/438450-Players-Players" }
    ]
  }),
  makeDiscographyEntry({
    slug: "the-spice-of-life",
    title: "The Spice Of Life",
    artist: "Kazumi Watanabe",
    year: "1987",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/395954-Kazumi-Watanabe-%E6%B8%A1%E8%BE%BA%E9%A6%99%E6%B4%A5%E7%BE%8E-The-Spice-Of-Life" }
    ]
  }),
  makeDiscographyEntry({
    slug: "the-spice-of-life-in-concert",
    title: "The Spice Of Life In Concert",
    artist: "Kazumi Watanabe",
    year: "1987",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/1790927-Kazumi-Watanabe-%E6%B8%A1%E8%BE%BA%E9%A6%99%E6%B4%A5%E7%BE%8E-The-Spice-Of-Life-In-Concert" }
    ]
  }),
  makeDiscographyEntry({
    slug: "the-spice-of-life-too",
    title: "The Spice Of Life Too",
    artist: "Kazumi Watanabe",
    year: "1988",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/223643-Kazumi-Watanabe-The-Spice-Of-Life-Too" }
    ]
  }),
  makeDiscographyEntry({
    slug: "take-me-back",
    title: "Take Me Back",
    artist: "John Warren",
    year: "1988",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/1253623-John-Warren-Take-Me-Back" }
    ]
  }),
  makeDiscographyEntry({
    slug: "electric-warrior-acoustic-saint",
    title: "Electric Warrior Acoustic Saint",
    artist: "Lanny Cordola",
    year: "1991",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/637443-Lanny-Cordola-Electric-Warrior-Acoustic-Saint" }
    ]
  }),
  makeDiscographyEntry({
    slug: "the-way-in",
    title: "The Way In",
    artist: "Jeff Richman",
    year: "1991",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/899104-Jeff-Richman-With-Al-Di-Meola-Steve-Lukather-Frank-Gambale-John-Abercrombie-The-Way-In" }
    ]
  }),
  makeDiscographyEntry({
    slug: "a-solitary-man",
    title: "A Solitary Man",
    artist: "Pete Levin",
    year: "1991",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/984127-Pete-Levin-A-Solitary-Man" }
    ]
  }),
  makeDiscographyEntry({
    slug: "know-now-no",
    title: "Know Now No",
    artist: "Blue X",
    year: "1992",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/977889-Blue-X-Know-Now-No" }
    ]
  }),
  makeDiscographyEntry({
    slug: "even-cowgirls-get-the-blues",
    title: "Music From The Motion Picture Soundtrack Even Cowgirls Get The Blues",
    artist: "k.d. lang",
    year: "1993",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/129003-kd-lang-Music-From-The-Motion-Picture-Soundtrack-Even-Cowgirls-Get-The-Blues" }
    ]
  }),
  makeDiscographyEntry({
    slug: "nathan",
    title: "Nathan",
    artist: "Nathan Cavaleri Band",
    year: "1994",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/788882-Nathan-Cavaleri-Band-Nathan" }
    ]
  }),
  makeDiscographyEntry({
    slug: "an-evening-of-yes-music-plus",
    title: "An Evening Of Yes Music Plus",
    artist: "Anderson Bruford Wakeman Howe",
    year: "1994",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/287958-Anderson-Bruford-Wakeman-Howe-An-Evening-Of-Yes-Music-Plus" }
    ]
  }),
  makeDiscographyEntry({
    slug: "playtime",
    title: "Playtime",
    artist: "Michael Zentner",
    year: "1995",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/2462626-Michael-Zentner-Playtime" }
    ]
  }),
  makeDiscographyEntry({
    slug: "the-inner-galactic-fusion-experience",
    title: "The Inner Galactic Fusion Experience",
    artist: "Richie Kotzen",
    year: "1995",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/807113-Richie-Kotzen-The-Inner-Galactic-Fusion-Experience" }
    ]
  }),
  makeDiscographyEntry({
    slug: "gossip",
    title: "Gossip",
    artist: "T Lavitz",
    year: "1996",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/6486335-T-Lavitz-Gossip" }
    ]
  }),
  makeDiscographyEntry({
    slug: "maiden-voyage",
    title: "Maiden Voyage",
    artist: "Kat Marco",
    year: "1996",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/11272557-Kat-Marco-Maiden-Voyage" }
    ]
  }),
  makeDiscographyEntry({
    slug: "crossroads",
    title: "Crossroads",
    artist: "Jeff Berlin",
    year: "1998",
    note:
      "A Jeff Berlin solo title that sits between the late-1990s return and the later independent records.",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/3155637-Jeff-Berlin-Crossroads" }
    ]
  }),
  makeDiscographyEntry({
    slug: "jazzsouth-program-38",
    title: "JazzSouth Program #38",
    artist: "Jeff Berlin, Bryan Lopes Trio, Michael Ross Quartet",
    year: "2001",
    format: "Compilation",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/15353773-Jeff-Berlin-Bryan-Lopes-Trio-Michael-Ross-Quartet-JazzSouth-Program-38" }
    ]
  }),
  makeDiscographyEntry({
    slug: "senor-juan-brahms",
    title: "Señor Juan Brahms",
    artist: "Richard Drexler",
    year: "2003",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/10690460-Richard-Drexler-Se%C3%B1or-Juan-Brahms" }
    ]
  }),
  makeDiscographyEntry({
    slug: "hyper-statue",
    title: "Hyper Statue",
    artist: "Carl Hupp Project",
    year: "2004",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/1791899-Carl-Hupp-Project-Hyper-Statue" }
    ]
  }),
  makeDiscographyEntry({
    slug: "twinemen",
    title: "Twinemen",
    artist: "Twinemen",
    year: "2004",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/252233-Twinemen-Twinemen" }
    ]
  }),
  makeDiscographyEntry({
    slug: "boston-t-party",
    title: "Boston T Party",
    artist: "Dennis Chambers, Jeff Berlin, David Fiuczynski, T. Lavitz",
    year: "2005",
    note:
      "A supergroup-style fusion record that puts Jeff Berlin in a headline ensemble with Dennis Chambers, David Fiuczynski, and T. Lavitz.",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/780428-Dennis-Chambers-Jeff-Berlin-David-Fiuczynski-T-Lavitz-Boston-T-Party" }
    ]
  }),
  makeDiscographyEntry({
    slug: "caravaggio",
    title: "Caravaggio",
    artist: "Massimo Colombo feat. Jeff Berlin & Billy Cobham",
    year: "2005",
    cover: "/music/credits/caravaggio.jpg",
    coverSource: "Apple Music",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/1770157-Massimo-Colombo-Feat-Jeff-Berlin-Billy-Cobham-Caravaggio" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/caravaggio-feat-jeff-berlin-billy-cobham/1352796602" }
    ]
  }),
  makeDiscographyEntry({
    slug: "rock-goes-to-college",
    title: "Rock Goes To College",
    artist: "Bruford",
    year: "2006",
    cover: "/music/credits/rock-goes-to-college.jpg",
    coverSource: "Apple Music",
    note:
      "A later live Bruford release that keeps Jeff Berlin's association with the band visible long after the original run.",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/469221-Bruford-Rock-Goes-To-College" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/rock-goes-to-college-live/256455655" }
    ]
  }),
  makeDiscographyEntry({
    slug: "novecento-featuring",
    title: "Novecento Featuring ...",
    artist: "Novecento",
    year: "2007",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/1128121-Novecento-Novecento-Featuring-" }
    ]
  }),
  makeDiscographyEntry({
    slug: "h-b-c",
    title: "H B C",
    artist: "Scott Henderson, Jeff Berlin, Dennis Chambers",
    year: "2012",
    cover: "/music/credits/hbc.jpg",
    coverSource: "Apple Music",
    note:
      "A heavyweight trio record with Scott Henderson, Jeff Berlin, and Dennis Chambers sharing headline billing.",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/599969-Scott-Henderson-2-Jeff-Berlin-Dennis-Chambers-H-B-C" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/hbc-feat-jeff-berlin-dennis-chambers/1050234934" }
    ]
  }),
  makeDiscographyEntry({
    slug: "groove-and-more",
    title: "Groove And More",
    artist: "Dennis Chambers",
    year: "2013",
    note:
      "A multi-guest Dennis Chambers record that includes Jeff Berlin among a strong cast of featured players.",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/8032118-Dennis-Chambers-Feat-Patti-Austin-Scott-Henderson-Stanley-Jordan-Brian-Auger-Jeff-Berlin-Novece" }
    ]
  }),
  makeDiscographyEntry({
    slug: "spinning-globe",
    title: "Spinning Globe",
    artist: "Kazumi Watanabe Featuring Jeff Berlin & Virgil Donati",
    year: "2013",
    cover: "/music/credits/spinning-globe.jpg",
    coverSource: "Apple Music",
    note:
      "Another major late-period fusion credit pairing Jeff Berlin with Kazumi Watanabe and Virgil Donati.",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/3341512-Kazumi-Watanabe-Featuring-Jeff-Berlin-Virgil-Donati-Spinning-Globe" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/spinning-globe/895150242" }
    ]
  }),
  makeDiscographyEntry({
    slug: "better-the-devil",
    title: "Better The Devil",
    artist: "The Bean Pickers Union",
    year: "2012",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/1684283-The-Bean-Pickers-Union-Better-The-Devil" }
    ]
  }),
  makeDiscographyEntry({
    slug: "stories",
    title: "Stories",
    artist: "Frank Pilato, Andrea Marcelli, Jeff Berlin, Mitchel Forman, Gary Willis",
    year: "2016",
    note:
      "A later ensemble credit with Jeff Berlin inside a lineup full of serious fusion and jazz players.",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/14603944-Frank-Pilato-Andrea-Marcelli-Jeff-Berlin-Mitchel-Forman-Gary-Willis-Stories" }
    ]
  }),
  makeDiscographyEntry({
    slug: "tokyo-concert",
    title: "Tokyo Concert",
    artist: "Gil Evans",
    year: "2010",
    format: "Live Album",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/2341663-Gil-Evans-Tokyo-Concert" }
    ]
  }),
  makeDiscographyEntry({
    slug: "true-stories-just-as-i-thought",
    title: "True Stories / Just As I Thought",
    artist: "David Sancious, David Sancious And Tone",
    year: "2016",
    format: "Compilation",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/12281604-David-Sancious-David-Sancious-And-Tone-True-Stories-Just-As-I-Thought" }
    ]
  }),
  makeDiscographyEntry({
    slug: "the-allan-holdsworth-solo-album-collection",
    title: "The Allan Holdsworth Solo Album Collection",
    artist: "Allan Holdsworth",
    year: "2017",
    format: "Box Set",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/1301924-Allan-Holdsworth-The-Allan-Holdsworth-Solo-Album-Collection" }
    ]
  }),
  makeDiscographyEntry({
    slug: "seems-like-a-lifetime-ago-1977-1980",
    title: "Seems Like A Lifetime Ago 1977-1980",
    artist: "Bruford",
    year: "2017",
    format: "Box Set",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/2249650-Bruford-Seems-Like-A-Lifetime-Ago-1977-1980" }
    ]
  }),
  makeDiscographyEntry({
    slug: "eidolon-the-allan-holdsworth-collection",
    title: "Eidolon (The Allan Holdsworth Collection)",
    artist: "Allan Holdsworth",
    year: "2017",
    format: "Compilation",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/2423659-Allan-Holdsworth-Eidolon-The-Allan-Holdsworth-Collection" }
    ]
  }),
  makeDiscographyEntry({
    slug: "joe-frazier-round-3",
    title: "Joe Frazier Round 3",
    artist: "Jeff Berlin",
    year: "2018",
    note:
      "A later Jeff Berlin solo release that extends the running Joe Frazier thread in his catalog.",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/3134949-Jeff-Berlin-Joe-Frazier-Round-3" }
    ]
  }),
  makeDiscographyEntry({
    slug: "live-at-the-venue-and-4th-album-rehearsal-sessions",
    title: "Live At The Venue & 4th Album Rehearsal Sessions",
    artist: "Bruford",
    year: "2020",
    format: "Live Album",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/1758428-Bruford-Live-At-The-Venue-4th-Album-Rehearsal-Sessions" }
    ]
  }),
  makeDiscographyEntry({
    slug: "vortex",
    title: "Vortex",
    artist: "Derek Sherinian",
    year: "2022",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/2698061-Derek-Sherinian-Vortex" }
    ]
  }),
  makeDiscographyEntry({
    slug: "keep-swingin-the-music-of-charlie-banacos",
    title: "Keep Swingin': The Music Of Charlie Banacos",
    artist: "Dial And DeRosa",
    year: "2024",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/35522251-Dial-And-DeRosa-Keep-Swingin-The-Music-Of-Charlie-Banacos" }
    ]
  }),
  makeDiscographyEntry({
    slug: "roberto-alejandro",
    title: "Roberto Alejandro",
    artist: "Roberto Alejandro",
    year: "1979",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/33192654-Roberto-Alejandro-Roberto-Alejandro" }
    ]
  }),
  makeDiscographyEntry({
    slug: "jolis-and-simone",
    title: "Jolis & Simone",
    artist: "Jolis & Simone",
    year: "1979",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/1672020-Jolis-Simone-Jolis-Simone" }
    ]
  }),
  makeDiscographyEntry({
    slug: "hurricane",
    title: "Hurricane",
    artist: "Ted Schumate - Dann Reno Jazz Quintet",
    year: "1985",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/1582505-Ted-Schumate-Dann-Reno-Jazz-Quintet-Hurricane" }
    ]
  }),
  makeDiscographyEntry({
    slug: "an-axe-to-grind",
    title: "An Axe To Grind",
    artist: "Tamplin And Friends",
    year: "1990",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/506598-Tamplin-And-Friends-An-Axe-To-Grind" }
    ]
  }),
  makeDiscographyEntry({
    slug: "no-borders",
    title: "No Borders",
    artist: "Walfredo Reyes Jr., Casey Scheuerell, Maria Martinez",
    year: "1992",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/15500401-Walfredo-Reyes-Jr-Casey-Scheuerell-Maria-Martinez-No-Borders" }
    ]
  }),
  makeDiscographyEntry({
    slug: "mixed-tracks",
    title: "Mixed Tracks",
    artist: "Nathan Cavaleri Band",
    year: "1994",
    cover: "/music/credits/archive-placeholder.svg",
    coverSource: "Local archive placeholder",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/33570825-Nathan-Cavaleri-Band-Mixed-Tracks" }
    ]
  }),
  makeDiscographyEntry({
    slug: "rehearsal-room-demos",
    title: "Rehearsal Room Demos",
    artist: "Nathan Cavaleri Band",
    year: "1994",
    cover: "/music/credits/archive-placeholder.svg",
    coverSource: "Local archive placeholder",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/33570882-Nathan-Cavaleri-Band-Rehearsal-Room-Demos" }
    ]
  }),
  makeDiscographyEntry({
    slug: "suppers-ready",
    title: "Supper's Ready",
    artist: "Various",
    year: "1995",
    format: "Compilation",
    jeffRole: "Credited appearance",
    note:
      "A prog-centered various-artists collection with Jeff Berlin credited on the release.",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/592208-Various-Suppers-Ready" }
    ]
  }),
  makeDiscographyEntry({
    slug: "doldingers-best",
    title: "Doldinger's Best",
    artist: "Klaus Doldinger",
    year: "1995",
    format: "Compilation",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/2749394-Klaus-Doldinger-Doldingers-Best" }
    ]
  }),
  makeDiscographyEntry({
    slug: "bassics-number-28",
    title: "Bassics Number 28",
    artist: "Various",
    year: "2001",
    format: "Compilation",
    jeffRole: "Track appearance",
    note:
      "A bass-focused compilation issue carrying a Jeff Berlin track appearance.",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/18354772-Various-Bassics-Number-28" }
    ]
  }),
  makeDiscographyEntry({
    slug: "bass-talk-7-lords-of-the-bass",
    title: "Bass-Talk 7 - Lords Of The Bass",
    artist: "Various",
    year: "2002",
    format: "Compilation",
    jeffRole: "Track appearance",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/9148748-Various-Bass-Talk-7-Lords-Of-The-Bass" }
    ]
  }),
  makeDiscographyEntry({
    slug: "jazz-magazine-vol-4",
    title: "Jazz Magazine Vol. 4",
    artist: "Various",
    year: "2002",
    format: "Compilation",
    jeffRole: "Track appearance",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/15152569-Various-Jazz-Magazine-Vol-4" }
    ]
  }),
  makeDiscographyEntry({
    slug: "grand-theft-auto-vice-city-official-soundtrack-box-set",
    title: "Grand Theft Auto Vice City Official Soundtrack Box Set",
    artist: "Various",
    year: "2002",
    format: "Soundtrack Box Set",
    jeffRole: "Track appearance",
    note:
      "An official soundtrack box set with Jeff Berlin represented in the game's curated music world.",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/648336-Various-Grand-Theft-Auto-Vice-City-Official-Soundtrack-Box-Set" }
    ]
  }),
  makeDiscographyEntry({
    slug: "jazz-live-in-samois",
    title: "Jazz Live In Samois (Tribute To Django Reinhardt 1988-1999 - 50th Anniversary)",
    artist: "Various",
    year: "2003",
    format: "Live Compilation",
    jeffRole: "Track appearance",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/6068040-Various-Jazz-Live-In-Samois-Tribute-To-Django-Reinhardt-1988-1999-50th-Anniversary" }
    ]
  }),
  makeDiscographyEntry({
    slug: "one-five-zero",
    title: "One Five Zero",
    artist: "Various",
    year: "2005",
    format: "Sampler",
    jeffRole: "Track appearance",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/9329198-Various-One-Five-Zero" }
    ]
  }),
  makeDiscographyEntry({
    slug: "bass-logic-from-the-players-school-of-music",
    title: "Bass Logic from the Players School of Music",
    artist: "Jeff Berlin",
    year: "2006",
    format: "Instructional DVD",
    jeffRole: "Instructor",
    note:
      "An official instructional release in Jeff Berlin's public discography, not just the listening catalog.",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/36604909-Jeff-Berlin-Bass-Logic-From-The-Players-School-Of-Music" }
    ]
  }),
  makeDiscographyEntry({
    slug: "drum-n-voice-vol-1-plus-2-all-that-groove",
    title: "Drum 'N' Voice Vol. 1 + 2 (All That Groove)",
    artist: "Billy Cobham",
    year: "2006",
    format: "Compilation",
    jeffRole: "Track appearance",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/3706174-Billy-Cobham-Drum-N-Voice-Vol-1-2-All-That-Groove" }
    ]
  }),
  makeDiscographyEntry({
    slug: "instrumental-collection-the-shrapnel-years",
    title: "Instrumental Collection-The Shrapnel Years",
    artist: "Richie Kotzen",
    year: "2006",
    format: "Compilation",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/5784666-Richie-Kotzen-Instrumental-Collection-The-Shrapnel-Years" }
    ]
  }),
  makeDiscographyEntry({
    slug: "drum-n-voice-2-due",
    title: "Drum 'N' Voice 2 (due)",
    artist: "Billy Cobham",
    year: "2006",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/6918871-Billy-Cobham-Drum-N-Voice-2-due" }
    ]
  }),
  makeDiscographyEntry({
    slug: "world-bass-heroes",
    title: "World BASS Heroes ～電気低音王special!～",
    artist: "Various",
    year: "2007",
    format: "Compilation",
    jeffRole: "Track appearance",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/17552608-Various-World-BASS-Heroes-%E9%9B%BB%E6%B0%97%E4%BD%8E%E9%9F%B3%E7%8E%8Bspecial" }
    ]
  }),
  makeDiscographyEntry({
    slug: "the-winterfold-collection-1978-1986",
    title: "The Winterfold Collection 1978-1986",
    artist: "Bill Bruford",
    year: "2009",
    format: "Compilation",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/2888373-Bill-Bruford-The-Winterfold-Collection-1978-1986" }
    ]
  }),
  makeDiscographyEntry({
    slug: "this-is-fusion-guitar",
    title: "Tone Center Presents • This Is Fusion Guitar",
    artist:
      "Various Featured Guitarists: Bill Connors, Larry Coryell, Dave Fiuczynski, Frank Gambale, Brett Garsed & TJ Helmerich, Scott Henderson, Jimmy Herring, Greg Howe, Eric Johnson, Chris Poland, Mike Stern",
    year: "2009",
    format: "Sampler",
    jeffRole: "Track appearance",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/8935671-Various-Featured-Guitarists-Bill-Connors-Larry-Coryell-Dave-Fiuczynski-Frank-Gambale-Brett-Gars" }
    ]
  }),
  makeDiscographyEntry({
    slug: "night-rains-plus-restless-eyes-plus-uncle-wonderful",
    title: "Night Rains ... Plus + Restless Eyes + Uncle Wonderful",
    artist: "Janis Ian",
    year: "2010",
    format: "Reissue Compilation",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/5196742-Janis-Ian-Night-Rains-Plus-Restless-Eyes-Uncle-Wonderful" }
    ]
  }),
  makeDiscographyEntry({
    slug: "jazziz-on-disc-fall-2010-night-and-day-autumn",
    title: "Jazziz On Disc - Fall 2010 - Night & Day: Autumn",
    artist: "Various",
    year: "2010",
    format: "Compilation",
    jeffRole: "Track appearance",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/15523120-Various-Jazziz-On-Disc-Fall-2010-Night-Day-Autumn" }
    ]
  }),
  makeDiscographyEntry({
    slug: "drum-n-voice-vol-1-2-3-the-collection",
    title: "Drum 'N' Voice Vol.1-2-3 The Collection",
    artist: "Billy Cobham",
    year: "2011",
    format: "Compilation",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/7631804-Billy-Cobham-Drum-N-Voice-Vol1-2-3-The-Collection" }
    ]
  }),
  makeDiscographyEntry({
    slug: "control-is-in-your-command-the-best-of-the-weisstronauts-1998-2012",
    title: "Control Is In Your Command: The Best Of The Weisstronauts 1998-2012",
    artist: "The Weisstronauts",
    year: "2012",
    format: "Best Of Compilation",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/15712424-The-Weisstronauts-Control-Is-In-Your-Command-The-Best-Of-The-Weisstronauts-1998-2012" }
    ]
  }),
  makeDiscographyEntry({
    slug: "through-the-years-from-1984-to-2012-the-definitive-collection",
    title: "Through The Years (From 1984 To 2012) The Definitve Collection",
    artist: "Novecento",
    year: "2013",
    format: "Compilation",
    jeffRole: "Track appearance",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/35133425-Novecento-Through-The-Years-From-1984-To-2012-The-Definitve-Collection" }
    ]
  }),
  makeDiscographyEntry({
    slug: "100-originalnih-hitova",
    title: "100 Originalnih Hitova",
    artist: "Crvena Jabuka",
    year: "2015",
    format: "Compilation",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/1810170-Crvena-Jabuka-100-Originalnih-Hitova" }
    ]
  }),
  makeDiscographyEntry({
    slug: "drum-n-voice-vol-1-2-3-4-the-complete-series",
    title: "Drum 'N' Voice Vol.1-2-3-4 The Complete Series",
    artist: "Billy Cobham",
    year: "2017",
    format: "Compilation",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/10791369-Billy-Cobham-Drum-N-Voice-Vol1-2-3-4-The-Complete-Series" }
    ]
  }),
  makeDiscographyEntry({
    slug: "sentieri-notturni",
    title: "Sentieri Notturni",
    artist: "Various",
    year: "2013",
    format: "Compilation",
    jeffRole: "Track appearance",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/22095058-Various-Sentieri-Notturni" }
    ]
  }),
  makeDiscographyEntry({
    slug: "mister-stormys-monday-selection-vol-2",
    title: "Mister Stormy's Monday Selection Vol.2",
    artist: "Mister Stormy",
    year: "2019",
    format: "Compilation",
    jeffRole: "Track appearance",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/14058248-Mister-Stormy-Mister-Stormys-Monday-Selection-Vol2" }
    ]
  }),
  makeDiscographyEntry({
    slug: "mister-stormys-monday-selection-vol-3",
    title: "Mister Stormy's Monday Selection Vol.3",
    artist: "Mister Stormy",
    year: "2019",
    format: "Compilation",
    jeffRole: "Track appearance",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/14250989-Mister-Stormy-Mister-Stormys-Monday-Selection-Vol3" }
    ]
  }),
  makeDiscographyEntry({
    slug: "jazz-magazine-vol-70",
    title: "Jazz Magazine Vol. 70",
    artist: "Various",
    year: "2020",
    format: "Compilation",
    jeffRole: "Track appearance",
    sources: [
      { label: "Discogs release", href: "https://www.discogs.com/release/28045923-Various-Jazz-Magazine-Vol-70" }
    ]
  })
];

export const musicAlbums = [...featuredMusicAlbums, ...discographyAlbums];

export const musicAlbumsBySlug = Object.fromEntries(
  musicAlbums.map((album) => [album.slug, album])
);
