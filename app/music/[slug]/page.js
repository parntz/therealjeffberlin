import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditableGroup from "../../../components/editable-group";
import EditableTextClient from "../../../components/editable-text-client";
import albumPurchaseLinks from "../../../data/album-purchase-links.json";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../../lib/admin-auth";
import { musicAlbums, musicAlbumsBySlug } from "../../../lib/music-data";
import {
  readSiteContentOverrides,
  resolveSiteContentValue
} from "../../../lib/site-content";

function makeAmazonAffiliateLink(url) {
  const tag = process.env.AMAZON_ASSOCIATE_TAG;

  if (!tag) {
    return url;
  }

  const target = new URL(url);
  target.searchParams.set("tag", tag);
  return target.toString();
}

function affiliateHref(purchaseLink) {
  if (!purchaseLink) {
    return null;
  }

  if (purchaseLink.provider.toLowerCase() === "amazon") {
    return makeAmazonAffiliateLink(purchaseLink.href);
  }

  return purchaseLink.href;
}

export function generateStaticParams() {
  return musicAlbums.map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const album = musicAlbumsBySlug[slug];

  if (!album) {
    return {
      title: "Album Not Found | Jeff Berlin"
    };
  }

  return {
    title: `${album.title} | Jeff Berlin Music`,
    description: `${album.title} (${album.year}) with Jeff Berlin on ${album.jeffRole.toLowerCase()}.`
  };
}

export default async function AlbumPage({ params }) {
  const { slug } = await params;
  const album = musicAlbumsBySlug[slug];
  const cookieStore = await cookies();
  const adminSession = readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
  );
  const isAdminSignedIn = Boolean(adminSession);
  const siteContentOverrides = await readSiteContentOverrides();

  if (!album) {
    notFound();
  }

  const rawPurchaseLink = albumPurchaseLinks[slug] || album.purchaseLink || null;
  const isAmazonPurchaseLink =
    rawPurchaseLink?.provider?.toLowerCase() === "amazon";
  const purchaseLink = rawPurchaseLink
    ? {
        provider: resolveSiteContentValue(
          siteContentOverrides,
          `music.case.${slug}.purchase.provider`,
          rawPurchaseLink.provider
        ),
        href: isAmazonPurchaseLink
          ? rawPurchaseLink.href
          : resolveSiteContentValue(
              siteContentOverrides,
              `music.case.${slug}.purchase.href`,
              rawPurchaseLink.href
            )
      }
    : null;
  const purchaseHref = affiliateHref(purchaseLink);

  return (
    <main className="page-shell">
      <article className="album-study">
        <section className="album-study-hero">
          <Link href="/music" className="album-study-back">
            Back to Music
          </Link>
          <div className="album-study-grid">
            <div className="album-study-cover">
              {album.cover ? (
                <img src={album.cover} alt={album.alt || album.title} />
              ) : (
                <div className="album-placeholder album-placeholder-large">
                  <span>{album.year}</span>
                  <strong>{album.title}</strong>
                  <em>{album.artist}</em>
                </div>
              )}
            </div>
            <div className="album-study-copy">
              <EditableGroup
                title={`Album — ${album.title} (header)`}
                isAdminSignedIn={isAdminSignedIn}
                className="album-study-header-editable"
              >
                <EditableTextClient
                  contentId={`music.case.${slug}.eyebrow`}
                  initialValue={resolveSiteContentValue(
                    siteContentOverrides,
                    `music.case.${slug}.eyebrow`,
                    "Album Case Study"
                  )}
                  as="p"
                  className="eyebrow"
                  rows={2}
                  isAdminSignedIn={isAdminSignedIn}
                  editLabel="Eyebrow"
                />
                <EditableTextClient
                  contentId={`music.case.${slug}.title`}
                  initialValue={resolveSiteContentValue(
                    siteContentOverrides,
                    `music.case.${slug}.title`,
                    album.title
                  )}
                  as="h1"
                  rows={3}
                  isAdminSignedIn={isAdminSignedIn}
                  editLabel="Title"
                />
                <EditableTextClient
                  contentId={`music.case.${slug}.intro`}
                  initialValue={resolveSiteContentValue(
                    siteContentOverrides,
                    `music.case.${slug}.intro`,
                    album.intro
                  )}
                  as="p"
                  className="album-study-dek"
                  rows={6}
                  isAdminSignedIn={isAdminSignedIn}
                  editLabel="Intro"
                />
              </EditableGroup>
              <EditableGroup
                title={`Album — ${album.title} (credits line)`}
                isAdminSignedIn={isAdminSignedIn}
                className="album-study-meta"
              >
                <EditableTextClient
                  contentId={`music.case.${slug}.artist`}
                  initialValue={resolveSiteContentValue(
                    siteContentOverrides,
                    `music.case.${slug}.artist`,
                    album.artist
                  )}
                  as="span"
                  wrapperAs="span"
                  rows={2}
                  isAdminSignedIn={isAdminSignedIn}
                  editLabel="Artist"
                />
                <EditableTextClient
                  contentId={`music.case.${slug}.year`}
                  initialValue={resolveSiteContentValue(
                    siteContentOverrides,
                    `music.case.${slug}.year`,
                    album.year
                  )}
                  as="span"
                  wrapperAs="span"
                  rows={2}
                  isAdminSignedIn={isAdminSignedIn}
                  editLabel="Year"
                />
                <EditableTextClient
                  contentId={`music.case.${slug}.format`}
                  initialValue={resolveSiteContentValue(
                    siteContentOverrides,
                    `music.case.${slug}.format`,
                    album.format
                  )}
                  as="span"
                  wrapperAs="span"
                  rows={2}
                  isAdminSignedIn={isAdminSignedIn}
                  editLabel="Format"
                />
                <EditableTextClient
                  contentId={`music.case.${slug}.jeffRole`}
                  initialValue={resolveSiteContentValue(
                    siteContentOverrides,
                    `music.case.${slug}.jeffRole`,
                    `Jeff: ${album.jeffRole}`
                  )}
                  as="span"
                  wrapperAs="span"
                  rows={2}
                  isAdminSignedIn={isAdminSignedIn}
                  editLabel="Jeff role"
                />
              </EditableGroup>
              {purchaseLink ? (
                <div className="album-study-purchase">
                  <a
                    href={purchaseHref}
                    target="_blank"
                    rel="noreferrer"
                    className="album-purchase-button"
                  >
                    {`Purchase This Album From ${purchaseLink.provider}`}
                  </a>
                  {isAdminSignedIn && !isAmazonPurchaseLink ? (
                    <EditableGroup
                      title={`Album — ${album.title} (purchase link)`}
                      isAdminSignedIn={isAdminSignedIn}
                      className="album-purchase-editors"
                    >
                      <EditableTextClient
                        contentId={`music.case.${slug}.purchase.provider`}
                        initialValue={purchaseLink.provider}
                        as="p"
                        rows={2}
                        isAdminSignedIn={isAdminSignedIn}
                        editLabel="Provider label"
                      />
                      <EditableTextClient
                        contentId={`music.case.${slug}.purchase.href`}
                        initialValue={purchaseLink.href}
                        as="p"
                        rows={3}
                        isAdminSignedIn={isAdminSignedIn}
                        editLabel="Purchase URL"
                      />
                    </EditableGroup>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="album-study-section album-study-split">
          <div className="album-study-panel">
            <EditableGroup
              title={`Album — ${album.title} (overview)`}
              isAdminSignedIn={isAdminSignedIn}
              className="album-overview-editable"
            >
              <EditableTextClient
                contentId={`music.case.${slug}.overview.heading`}
                initialValue={resolveSiteContentValue(
                  siteContentOverrides,
                  `music.case.${slug}.overview.heading`,
                  "Overview"
                )}
                as="h2"
                rows={2}
                isAdminSignedIn={isAdminSignedIn}
                editLabel="Section heading"
              />
              <div className="album-study-prose">
                {album.caseStudy.map((paragraph, index) => (
                  <EditableTextClient
                    key={`${slug}-case-${index}`}
                    contentId={`music.case.${slug}.caseStudy.${index}`}
                    initialValue={resolveSiteContentValue(
                      siteContentOverrides,
                      `music.case.${slug}.caseStudy.${index}`,
                      paragraph
                    )}
                    as="p"
                    rows={6}
                    isAdminSignedIn={isAdminSignedIn}
                    editLabel={`Paragraph ${index + 1}`}
                  />
                ))}
              </div>
            </EditableGroup>
          </div>
          <div className="album-study-panel">
            <EditableGroup
              title={`Album — ${album.title} (snapshot)`}
              isAdminSignedIn={isAdminSignedIn}
              className="album-snapshot-editable"
            >
              <EditableTextClient
                contentId={`music.case.${slug}.snapshot.heading`}
                initialValue={resolveSiteContentValue(
                  siteContentOverrides,
                  `music.case.${slug}.snapshot.heading`,
                  "Quick Snapshot"
                )}
                as="h2"
                rows={2}
                isAdminSignedIn={isAdminSignedIn}
                editLabel="Section heading"
              />
              <ul className="album-study-list">
                {album.snapshot.map((item, index) => (
                  <li key={`${slug}-snapshot-${index}`}>
                    <EditableTextClient
                      contentId={`music.case.${slug}.snapshot.${index}`}
                      initialValue={resolveSiteContentValue(
                        siteContentOverrides,
                        `music.case.${slug}.snapshot.${index}`,
                        item
                      )}
                      as="span"
                      wrapperAs="span"
                      rows={4}
                      isAdminSignedIn={isAdminSignedIn}
                      editLabel={`Bullet ${index + 1}`}
                    />
                  </li>
                ))}
              </ul>
            </EditableGroup>
          </div>
        </section>

        <section className="album-study-section">
          <div className="album-detail-grid">
            {album.highlights.map((item, index) => (
              <article key={`${slug}-highlight-${index}`} className="album-detail-card">
                <EditableGroup
                  title={`Album — ${album.title} (highlight ${index + 1})`}
                  isAdminSignedIn={isAdminSignedIn}
                  className="album-highlight-editable"
                >
                  <EditableTextClient
                    contentId={`music.case.${slug}.highlights.${index}.title`}
                    initialValue={resolveSiteContentValue(
                      siteContentOverrides,
                      `music.case.${slug}.highlights.${index}.title`,
                      item.title
                    )}
                    as="h3"
                    rows={2}
                    isAdminSignedIn={isAdminSignedIn}
                    editLabel="Title"
                  />
                  <EditableTextClient
                    contentId={`music.case.${slug}.highlights.${index}.body`}
                    initialValue={resolveSiteContentValue(
                      siteContentOverrides,
                      `music.case.${slug}.highlights.${index}.body`,
                      item.body
                    )}
                    as="p"
                    rows={5}
                    isAdminSignedIn={isAdminSignedIn}
                    editLabel="Body"
                  />
                </EditableGroup>
              </article>
            ))}
          </div>
        </section>

        <section className="album-study-section">
          <div className="album-study-panel">
            <EditableGroup
              title={`Album — ${album.title} (listen for)`}
              isAdminSignedIn={isAdminSignedIn}
              className="album-listen-editable"
            >
              <EditableTextClient
                contentId={`music.case.${slug}.listen.heading`}
                initialValue={resolveSiteContentValue(
                  siteContentOverrides,
                  `music.case.${slug}.listen.heading`,
                  "Listen For"
                )}
                as="h2"
                rows={2}
                isAdminSignedIn={isAdminSignedIn}
                editLabel="Section heading"
              />
              <div className="album-detail-grid album-detail-grid-compact">
                {album.trackMoments.map((item, index) => (
                  <article key={`${slug}-listen-${index}`} className="album-detail-card">
                    <EditableTextClient
                      contentId={`music.case.${slug}.trackMoments.${index}.title`}
                      initialValue={resolveSiteContentValue(
                        siteContentOverrides,
                        `music.case.${slug}.trackMoments.${index}.title`,
                        item.title
                      )}
                      as="h3"
                      rows={2}
                      isAdminSignedIn={isAdminSignedIn}
                      editLabel={`Moment ${index + 1} — title`}
                    />
                    <EditableTextClient
                      contentId={`music.case.${slug}.trackMoments.${index}.body`}
                      initialValue={resolveSiteContentValue(
                        siteContentOverrides,
                        `music.case.${slug}.trackMoments.${index}.body`,
                        item.body
                      )}
                      as="p"
                      rows={5}
                      isAdminSignedIn={isAdminSignedIn}
                      editLabel={`Moment ${index + 1} — body`}
                    />
                  </article>
                ))}
              </div>
            </EditableGroup>
          </div>
        </section>

        <section className="album-study-section">
          <div className="album-study-panel">
            <EditableGroup
              title={`Album — ${album.title} (sources)`}
              isAdminSignedIn={isAdminSignedIn}
              className="album-sources-editable"
            >
              <EditableTextClient
                contentId={`music.case.${slug}.sources.heading`}
                initialValue={resolveSiteContentValue(
                  siteContentOverrides,
                  `music.case.${slug}.sources.heading`,
                  "Sources"
                )}
                as="h2"
                rows={2}
                isAdminSignedIn={isAdminSignedIn}
                editLabel="Section heading"
              />
              <div className="album-source-list">
                {album.sources.map((source, index) => {
                  const sourceHref = resolveSiteContentValue(
                    siteContentOverrides,
                    `music.case.${slug}.sources.${index}.href`,
                    source.href
                  );

                  return (
                    <div key={`${slug}-source-${index}`} className="album-source-item">
                      <a href={sourceHref} target="_blank" rel="noreferrer">
                        {resolveSiteContentValue(
                          siteContentOverrides,
                          `music.case.${slug}.sources.${index}.label`,
                          source.label
                        )}
                      </a>
                      {isAdminSignedIn ? (
                        <div className="album-source-editors">
                          <EditableTextClient
                            contentId={`music.case.${slug}.sources.${index}.label`}
                            initialValue={resolveSiteContentValue(
                              siteContentOverrides,
                              `music.case.${slug}.sources.${index}.label`,
                              source.label
                            )}
                            as="p"
                            rows={2}
                            isAdminSignedIn={isAdminSignedIn}
                            editLabel={`Source ${index + 1} — label`}
                          />
                          <EditableTextClient
                            contentId={`music.case.${slug}.sources.${index}.href`}
                            initialValue={sourceHref}
                            as="p"
                            rows={3}
                            isAdminSignedIn={isAdminSignedIn}
                            editLabel={`Source ${index + 1} — URL`}
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </EditableGroup>
          </div>
        </section>
      </article>
    </main>
  );
}
