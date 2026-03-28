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
    return "It presents Jeff Berlin in a leader-focused setting rather than a sideman credit.";
  }

  if (jeffRole.toLowerCase().includes("track")) {
    return `It captures one of Jeff's track-level appearances within a release credited to ${artist}.`;
  }

  return `It places Jeff inside ${artist}'s musical world and the way that project is framed.`;
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
        return `${title} shows Jeff appearing on a curated release where a single track carried his name into a different audience.`;
      }

      return `${title} is a dated example of Jeff Berlin appearing in another artist's project.`;
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
    intro: `${title} is a ${year} ${formatLabel} credited to ${artist}, with Jeff Berlin appearing here as ${roleLabel}.`,
    snapshot: [
      `${artist} issued ${title} in ${year} as a ${formatLabel}.`,
      `Jeff Berlin is credited on the release as ${roleLabel}.`,
      coverSource
        ? `Artwork on this page is sourced from ${coverSource}.`
        : `This ${formatLabel} is part of Jeff Berlin's broader recorded discography.`
    ],
    caseStudy: [
      noteLine,
      artistLine,
      `Placed in ${year}, ${title} sits alongside the releases and collaborations around that period.`
    ],
    highlights: [
      {
        title: "Release frame",
        body: `${title} is presented here as a ${formatLabel}, which shapes how the credit reads on the release itself.`
      },
      {
        title: "Jeff's role",
        body: `On this release Jeff Berlin is documented as ${roleLabel}.`
      },
      {
        title: "Musical context",
        body: `${title} connects Jeff to a specific ${year} release and its surrounding musical context.`
      }
    ],
    trackMoments: [
      {
        title: "Read the context",
        body: `Start with the way ${title} is framed: title, artist credit, year, and format all tell you what kind of release this is before a note is played.`
      },
      {
        title: "Hear Jeff's position",
        body: jeffRole.toLowerCase().includes("track")
          ? "This is the kind of release where Jeff's appearance is narrower, so the interesting question is how his contribution lands inside a larger sequence."
          : `The useful listen here is hearing how Jeff functions within ${artist}'s musical world rather than assuming the page is about a solo-bass showcase.`
      },
      {
        title: "Hear it in context",
        body: `${title} makes more sense when heard against the Jeff Berlin releases immediately around ${year}.`
      }
    ]
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
  sources
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
      "Bill Bruford's first solo studio album, released in 1978.",
      "The lineup includes Allan Holdsworth, Dave Stewart, Kenny Wheeler, Annette Peacock, and Jeff Berlin.",
      "The album helped establish the Bruford group that followed."
    ],
    caseStudy: [
      "The record is not just an early Jeff Berlin credit. It is the sound of several strong musical personalities colliding in a very specific late-1970s progressive-fusion zone and somehow making it feel composed rather than chaotic.",
      "Berlin's role is not decorative. His bass playing gives the album a fast, articulate center of gravity, especially against Bruford's sharper rhythmic language and Holdsworth's floating guitar lines.",
      "If someone wants to understand why Jeff Berlin's name carries weight with serious players, this is one of the first albums to study closely."
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
      }
    ],
    sources: [
      {
        label: "Wikipedia",
        href: "https://en.wikipedia.org/wiki/Feels_Good_to_Me"
      },
      {
        label: "AllMusic review",
        href: "https://www.allmusic.com/album/feels-good-to-me-mw0000654005"
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
      "An ambitious Patrick Moraz concept album with Jeff Berlin on bass, Brazilian rhythmic influence, and a single-song design spread across fourteen sections.",
    intro:
      "The Story of I shows Jeff inside a much more concept-heavy, globally inflected setting where the bass has to support a larger architecture rather than dominate the room.",
    snapshot: [
      "Patrick Moraz released the album in April 1976 during a break from Yes.",
      "The album is a concept piece built around a fictional building and is structured as one long song broken into sections.",
      "Jeff Berlin is credited on bass, with Brazilian and Latin percussion shaping much of the atmosphere."
    ],
    caseStudy: [
      "This is one of the most musically adventurous credits in Berlin's broader orbit. Moraz mixes progressive rock, jazz fusion, and world-music influence into something unusually narrative and textural.",
      "For Jeff Berlin's story, the interesting part is hearing him in a record that depends on color, pacing, and arrangement logic as much as chops. The album is proof that his career was never confined to one narrow fusion lane.",
      "It is also a cool record because the concept is strange, the personnel is strong, and the overall ambition feels fearless."
    ],
    highlights: [
      {
        title: "A full concept build",
        body: "The album centers on a symbolic building and plays as one long composition divided into 14 tracks."
      },
      {
        title: "Brazilian influence",
        body: "Wikipedia notes that much of the percussion was recorded in Rio de Janeiro and dubbed onto the tracks."
      },
      {
        title: "Outside the obvious lane",
        body: "This credit shows Berlin inside a more atmospheric and globally influenced progressive setting."
      }
    ],
    trackMoments: [
      {
        title: "One long-form piece",
        body: "The design itself is the hook here: the whole album functions as a single composition."
      },
      {
        title: "Percussion-led tension",
        body: "The Brazilian rhythmic frame gives the record a pulse very different from the Bruford material."
      },
      {
        title: "Keyboard architecture",
        body: "Moraz's arrangement approach creates a denser environment for the rhythm section to navigate."
      }
    ],
    sources: [
      {
        label: "Wikipedia",
        href: "https://en.wikipedia.org/wiki/The_Story_of_I"
      },
      {
        label: "AllMusic review",
        href: "https://www.allmusic.com/album/r45062"
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
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/136743-Patti-Austin-End-Of-A-Rainbow" }
    ]
  }),
  makeDiscographyEntry({
    slug: "shoogie-wanna-boogie",
    title: "Shoogie Wanna Boogie",
    artist: "David Matthews With Whirlwind",
    year: "1976",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/211273-David-Matthews-With-Whirlwind-Shoogie-Wanna-Boogie" }
    ]
  }),
  makeDiscographyEntry({
    slug: "capricorn-princess",
    title: "Capricorn Princess",
    artist: "Esther Phillips",
    year: "1976",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/10879-Esther-Phillips-Capricorn-Princess" }
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
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/288308-Barretto-Eye-Of-The-Beholder" }
    ]
  }),
  makeDiscographyEntry({
    slug: "home-in-the-country",
    title: "Home In The Country",
    artist: "Pee Wee Ellis",
    year: "1977",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/429667-Pee-Wee-Ellis-Home-In-The-Country" }
    ]
  }),
  makeDiscographyEntry({
    slug: "mixed-roots",
    title: "Mixed Roots",
    artist: "Al Foster",
    year: "1978",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/289214-Al-Foster-Mixed-Roots" }
    ]
  }),
  makeDiscographyEntry({
    slug: "montreux-concert",
    title: "Montreux Concert",
    artist: "Don Pullen",
    year: "1978",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/528976-Don-Pullen-Montreux-Concert" }
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
    note:
      "A live Bruford document that captures Jeff Berlin in one of the core touring versions of the group.",
    sources: [
      { label: "Discogs master", href: "https://www.discogs.com/master/230496-Bruford-The-Bruford-Tapes" }
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
