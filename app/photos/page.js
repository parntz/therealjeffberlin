import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";

import EditableTextClient from "../../components/editable-text-client";
import PhotosGallery from "../../components/photos-gallery";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../lib/admin-auth";
import {
  isRealImageFile,
  publicPathToFilepath,
  readDeletedPhotos,
  readPhotoOverrides,
  titleFromFilename
} from "../../lib/photo-library";
import {
  readSiteContentOverrides,
  resolveSiteContentValue
} from "../../lib/site-content";

function getHarvestEntries(deletedPaths) {
  const harvestDir = path.join(process.cwd(), "public", "images", "photos", "harvest");

  if (!fs.existsSync(harvestDir)) {
    return [];
  }

  return fs
    .readdirSync(harvestDir)
    .filter((filename) => /\.(png|jpe?g|webp)$/i.test(filename))
    .filter((filename) => isRealImageFile(path.join(harvestDir, filename)))
    .filter((filename) => !deletedPaths.has(`/images/photos/harvest/${filename}`))
    .sort()
    .map((filename, index) => ({
      id: `harvest-${index + 1}`,
      title: titleFromFilename(filename),
      year: "Harvest",
      image: `/images/photos/harvest/${filename}`,
      imagePath: `/images/photos/harvest/${filename}`,
      alt: `Jeff Berlin photo ${index + 1}.`,
      note: "Bulk-collected local photo asset.",
      sourceLabel: "Harvested source",
      sourceHref: null
    }));
}

const photoEntries = [
  {
    id: "screen-grab",
    title: "Screen Grab",
    year: "Official",
    image: "/images/photos/jeff-berlin-screen-grab.jpg",
    imagePath: "/images/photos/jeff-berlin-screen-grab.jpg",
    alt: "Jeff Berlin promotional screen grab from Jeff Berlin Music Group.",
    note:
      "Large promotional image sourced from the Jeff Berlin Music Group recordings page.",
    sourceLabel: "Jeff Berlin Music Group",
    sourceHref: "https://www.jeffberlinmusicgroup.com/music"
  },
  {
    id: "guitarworld-jaco",
    title: "With Jaco",
    year: "2023 feature",
    image: "/images/photos/jeff-berlin-jaco-guitarworld.jpg",
    imagePath: "/images/photos/jeff-berlin-jaco-guitarworld.jpg",
    alt: "Jeff Berlin pictured alongside Jaco Pastorius in a Guitar World feature image.",
    note:
      "Large editorial feature image from Guitar World.",
    sourceLabel: "Guitar World",
    sourceHref:
      "https://www.guitarworld.com/features/jeff-berlin-look-at-jaco-pastorius-clearly-a-genius-but-misunderstood"
  },
  {
    id: "guitarworld-portrait",
    title: "Feature Portrait",
    year: "2023 feature",
    image: "/images/photos/jeff-berlin-guitarworld-portrait.jpeg",
    imagePath: "/images/photos/jeff-berlin-guitarworld-portrait.jpeg",
    alt: "Jeff Berlin portrait used in a Guitar World feature.",
    note:
      "Single-artist editorial portrait from Guitar World.",
    sourceLabel: "Guitar World",
    sourceHref:
      "https://www.guitarworld.com/features/jeff-berlin-look-at-jaco-pastorius-clearly-a-genius-but-misunderstood"
  },
  {
    id: "about-hero",
    title: "About Hero",
    year: "Official",
    image: "/images/photos/jeff-berlin-about-hero.jpg",
    imagePath: "/images/photos/jeff-berlin-about-hero.jpg",
    alt: "Jeff Berlin official about-page hero image.",
    note:
      "Official-site banner image from Jeff Berlin's about page.",
    sourceLabel: "Jeff Berlin Official",
    sourceHref: "https://www.jeffberlinofficial.com/about"
  },
  {
    id: "marked",
    title: "Stage Focus",
    year: "Archive",
    image: "/images/photos/jeff-berlin-marked.jpg",
    imagePath: "/images/photos/jeff-berlin-marked.jpg",
    alt: "Jeff Berlin playing bass on stage under warm lighting.",
    note:
      "A tight performance portrait used here as one of the anchor images in the photo layout.",
    sourceLabel: "Project archive",
    sourceHref: null
  },
  {
    id: "jbmg-banner",
    title: "Purple Banner",
    year: "Official",
    image: "/images/photos/jeff-berlin-jbmg-banner.jpg",
    imagePath: "/images/photos/jeff-berlin-jbmg-banner.jpg",
    alt: "Jeff Berlin panoramic banner image from Jeff Berlin Music Group.",
    note:
      "Wide banner image from the Jeff Berlin Music Group about page.",
    sourceLabel: "Jeff Berlin Music Group",
    sourceHref: "https://www.jeffberlinmusicgroup.com/aboutus"
  },
  {
    id: "austin",
    title: "Austin 2007",
    year: "2007",
    image: "/images/photos/jeff-berlin-austin-2007.jpg",
    imagePath: "/images/photos/jeff-berlin-austin-2007.jpg",
    alt: "Jeff Berlin performing live during the Bx3 tour in Austin, Texas in 2007.",
    note:
      "Live image from the Bx3 tour in Austin, Texas. Photographer attribution and license details are linked below.",
    sourceLabel: "Wikimedia Commons",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Jeff_Berlin_2007_in_Austin_TX.jpg"
  },
  {
    id: "live",
    title: "Live 2007",
    year: "Archive",
    image: "/images/jeff-live-2007.jpg",
    imagePath: "/images/jeff-live-2007.jpg",
    alt: "Jeff Berlin performing live in 2007.",
    note:
      "A vertical live shot already present in the project and used here as part of the layered contact sheet.",
    sourceLabel: "Project archive",
    sourceHref: null
  },
  {
    id: "notreble-2015",
    title: "Jack Songs Era",
    year: "2015",
    image: "/images/photos/jeff-berlin-notreble-2015.jpg",
    imagePath: "/images/photos/jeff-berlin-notreble-2015.jpg",
    alt: "Jeff Berlin promotional portrait from a No Treble news item.",
    note:
      "Mid-size press image pulled from a No Treble article.",
    sourceLabel: "No Treble",
    sourceHref: "https://www.notreble.com/buzz/2015/09/21/jeff-berlin-and-jack-songs/"
  },
  {
    id: "joe-frazier",
    title: "Joe Frazier Promo",
    year: "Official",
    image: "/images/photos/jeff-berlin-joe-frazier-promo.jpg",
    imagePath: "/images/photos/jeff-berlin-joe-frazier-promo.jpg",
    alt: "Jeff Berlin Joe Frazier Round 3 promotional image.",
    note:
      "Square promotional artwork from the Jeff Berlin Music Group recordings page.",
    sourceLabel: "Jeff Berlin Music Group",
    sourceHref: "https://www.jeffberlinmusicgroup.com/music"
  },
  {
    id: "official-cutout",
    title: "Official Cutout",
    year: "Official",
    image: "/images/photos/jeff-berlin-official-cutout.png",
    imagePath: "/images/photos/jeff-berlin-official-cutout.png",
    alt: "Jeff Berlin official cutout image from the official site.",
    note:
      "Transparent official-site cutout used for promo and layout work.",
    sourceLabel: "Jeff Berlin Official",
    sourceHref: "https://www.jeffberlinofficial.com/about"
  },
  {
    id: "cort-rithimic-hero",
    title: "Rithimic Hero",
    year: "Cort",
    image: "/images/photos/jeff-berlin-cort-rithimic-hero.jpg",
    imagePath: "/images/photos/jeff-berlin-cort-rithimic-hero.jpg",
    alt: "Jeff Berlin with his Cort Rithimic bass in a wide Cort artist banner.",
    note:
      "Large Cort artist banner image.",
    sourceLabel: "Cort Guitars",
    sourceHref: "https://www.cortguitars.com/product/item.php?ca_id=103040&it_id=1617343994"
  },
  {
    id: "cort-rithimic-mobile",
    title: "Rithimic Mobile",
    year: "Cort",
    image: "/images/photos/jeff-berlin-cort-rithimic-hero-mobile.jpg",
    imagePath: "/images/photos/jeff-berlin-cort-rithimic-hero-mobile.jpg",
    alt: "Jeff Berlin in a Cort mobile hero image with his signature bass.",
    note:
      "Alternate mobile-format Cort artist image.",
    sourceLabel: "Cort Guitars",
    sourceHref: "https://www.cortguitars.com/product/item.php?ca_id=103040&it_id=1617343994"
  },
  {
    id: "cort-video",
    title: "Cort Session",
    year: "Cort",
    image: "/images/photos/jeff-berlin-cort-video.jpg",
    imagePath: "/images/photos/jeff-berlin-cort-video.jpg",
    alt: "Jeff Berlin in a Cort artist video still.",
    note:
      "Cort artist video still.",
    sourceLabel: "Cort Guitars",
    sourceHref: "https://www.cortguitars.com/artist/item.php?ca_id=101020&it_id=1547008471&page=1"
  },
  {
    id: "clean",
    title: "Arena Cutout",
    year: "Archive",
    image: "/Jeff_Berlin_clean.png",
    imagePath: "/Jeff_Berlin_clean.png",
    alt: "Jeff Berlin isolated against a transparent background, holding a bass on stage.",
    note:
      "A larger cutout-style stage image used as the visual sweep across the lower half of the page.",
    sourceLabel: "Project archive",
    sourceHref: null
  }
];

function isRenderablePhoto(photo, deletedPaths) {
  if (deletedPaths.has(photo.imagePath)) {
    return false;
  }

  try {
    const filepath = publicPathToFilepath(photo.imagePath);
    return fs.existsSync(filepath) && isRealImageFile(filepath);
  } catch {
    return false;
  }
}

export const metadata = {
  title: "Photos | Jeff Berlin",
  description: "A stylized Jeff Berlin photo page built as an editorial contact sheet."
};

export default async function PhotosPage() {
  const cookieStore = await cookies();
  const adminSession = readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
  );
  const [photoOverrides, deletedPhotos, siteContentOverrides] = await Promise.all([
    readPhotoOverrides(),
    readDeletedPhotos(),
    readSiteContentOverrides()
  ]);
  const deletedPaths = new Set(deletedPhotos.map((entry) => entry.image));
  const photos = [
    ...photoEntries.filter((photo) => isRenderablePhoto(photo, deletedPaths)),
    ...getHarvestEntries(deletedPaths)
  ].map((photo) => {
    const override = photoOverrides[photo.imagePath];

    if (!override) {
      return {
        ...photo,
        source: photo.sourceLabel || photo.year || "",
        description: photo.note || ""
      };
    }

    return {
      ...photo,
      title: override.title || photo.title,
      note: override.description,
      description: override.description,
      source: override.source || photo.sourceLabel || photo.year || ""
    };
  });

  return (
    <main className="page-shell photos-page">
      <section className="photos-hero">
        <div className="photos-hero-copy">
          <EditableTextClient
            contentId="photos.hero.eyebrow"
            initialValue={resolveSiteContentValue(
              siteContentOverrides,
              "photos.hero.eyebrow",
              "Photos"
            )}
            as="p"
            className="eyebrow"
            rows={2}
            isAdminSignedIn={Boolean(adminSession)}
          />
          <EditableTextClient
            contentId="photos.hero.title"
            initialValue={resolveSiteContentValue(
              siteContentOverrides,
              "photos.hero.title",
              "Light, motion, bass, silhouette."
            )}
            as="h1"
            rows={3}
            isAdminSignedIn={Boolean(adminSession)}
          />
          <EditableTextClient
            contentId="photos.hero.dek"
            initialValue={resolveSiteContentValue(
              siteContentOverrides,
              "photos.hero.dek",
              "A photo page built like a studio light table: layered frames, cropped stage moments, and a cleaner presentation than a standard gallery wall."
            )}
            as="p"
            className="photos-hero-dek"
            rows={5}
            isAdminSignedIn={Boolean(adminSession)}
          />
          <div className="photos-hero-meta">
            <span>Performance portraits</span>
            <span>Archive material</span>
            <span>Local lightbox assets</span>
          </div>
        </div>

        <div className="photos-hero-aside">
          <EditableTextClient
            contentId="photos.hero.aside"
            initialValue={resolveSiteContentValue(
              siteContentOverrides,
              "photos.hero.aside",
              "Official images, archive shots, and licensed live photography gathered into one local gallery."
            )}
            as="p"
            rows={4}
            isAdminSignedIn={Boolean(adminSession)}
          />
        </div>
      </section>

      <PhotosGallery photos={photos} isAdminSignedIn={Boolean(adminSession)} />
    </main>
  );
}
