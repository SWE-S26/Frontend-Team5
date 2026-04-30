"use client"

import { useState, useEffect, useMemo } from "react"
import { Select } from "antd"
import { Check } from "lucide-react"
import Button from "@/components/ui/Button"
import InfoPopover from "@/components/settings/InfoPopover"
import CB from "@/components/settings/CB"
import { useContentSettings } from "@/hooks/useSettings"

// ─── Constants ────────────────────────────────────────────────────────────────

const EMAIL_OPTIONS = [
  { value: "none",    label: "Don't display email address" },
  { value: "display", label: "Display email address" },
]

const CATEGORY_OPTIONS = [
  { value: "arts",       label: "Arts" },
  { value: "business",   label: "Business" },
  { value: "comedy",     label: "Comedy" },
  { value: "education",  label: "Education" },
  { value: "fiction",    label: "Fiction" },
  { value: "government", label: "Government" },
  { value: "health",     label: "Health & Fitness" },
  { value: "history",    label: "History" },
  { value: "kids",       label: "Kids & Family" },
  { value: "leisure",    label: "Leisure" },
  { value: "music",      label: "Music" },
  { value: "news",       label: "News" },
  { value: "religion",   label: "Religion & Spirituality" },
  { value: "science",    label: "Science" },
  { value: "society",    label: "Society & Culture" },
  { value: "sports",     label: "Sports" },
  { value: "technology", label: "Technology" },
  { value: "truecrime",  label: "True Crime" },
  { value: "tv",         label: "TV & Film" },
]

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
]

const RSS_FEED_INFO = "Share your uploads with an RSS feed to enable your listeners to subscribe in Podcasting apps"
const STATS_INFO    = "To use a 3rd-party service to track RSS activity, insert a URL prefix here. Podtrac users, enter http://www.podtrac.com/pts/redirect.mp3/"
const REDIRECT_INFO = "Adding a URL here will redirect your SoundCloud RSS feed to a new location"
const UPLOAD_INFO   = "Save time during upload by setting defaults. Track options can be changed at any time when uploading or editing"

// ─── Field components ─────────────────────────────────────────────────────────

function TextInput({
  placeholder,
  value,
  onChange,
  readOnly,
}: {
  placeholder?: string
  value: string
  onChange?: (v: string) => void
  readOnly?: boolean
}) {
  return (
    <input
      type="text"
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={`
        w-full h-8 px-3 rounded-md text-sm text-white-smoke
        bg-off-black border border-white-smoke/20
        placeholder:text-white-smoke/30
        focus:outline-none focus:border-white-smoke/50
        transition-colors
        ${readOnly ? "cursor-default opacity-70 select-all" : ""}
      `}
    />
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Content() {
  const { settings, loading, saveStatus, updateSettings } = useContentSettings()

  const [rssFeed,            setRssFeed]            = useState("")
  const [emailDisplay,       setEmailDisplay]       = useState("none")
  const [customFeedTitle,    setCustomFeedTitle]    = useState("")
  const [category,           setCategory]           = useState("")
  const [statsPrefix,        setStatsPrefix]        = useState("")
  const [customAuthorName,   setCustomAuthorName]   = useState("")
  const [subscriberRedirect, setSubscriberRedirect] = useState("")
  const [explicitContent,    setExplicitContent]    = useState(false)
  const [includeInRss,       setIncludeInRss]       = useState(false)
  const [creativeCommons,    setCreativeCommons]    = useState(false)

  const [savedEmailDisplay,       setSavedEmailDisplay]       = useState("none")
  const [savedCustomFeedTitle,    setSavedCustomFeedTitle]    = useState("")
  const [savedCategory,           setSavedCategory]           = useState("")
  const [savedStatsPrefix,        setSavedStatsPrefix]        = useState("")
  const [savedCustomAuthorName,   setSavedCustomAuthorName]   = useState("")
  const [savedSubscriberRedirect, setSavedSubscriberRedirect] = useState("")
  const [savedExplicitContent,    setSavedExplicitContent]    = useState(false)
  const [savedIncludeInRss,       setSavedIncludeInRss]       = useState(false)
  const [savedCreativeCommons,    setSavedCreativeCommons]    = useState(false)

  useEffect(() => {
    if (!settings) return

    const rss      = settings.rssFeedLink            ?? ""
    const email    = settings.rssEmailDisplayed      ?? "none"
    const feedTitle = settings.customFieldTitle      ?? ""
    const cat      = settings.category               ?? ""
    const stats    = settings.statsServiceUrlPrefix  ?? ""
    const author   = settings.customAuthorName       ?? ""
    const redirect = settings.subscriberRedirect     ?? ""
    const explicit = settings.containsExplicitContent ?? false
    const inRss    = settings.includeInRssFeed       ?? false
    const cc       = settings.creativeCommonsLicense ?? false

    setRssFeed(rss)
    setEmailDisplay(email)
    setCustomFeedTitle(feedTitle)
    setCategory(cat)
    setStatsPrefix(stats)
    setCustomAuthorName(author)
    setSubscriberRedirect(redirect)
    setExplicitContent(explicit)
    setIncludeInRss(inRss)
    setCreativeCommons(cc)

    setSavedEmailDisplay(email)
    setSavedCustomFeedTitle(feedTitle)
    setSavedCategory(cat)
    setSavedStatsPrefix(stats)
    setSavedCustomAuthorName(author)
    setSavedSubscriberRedirect(redirect)
    setSavedExplicitContent(explicit)
    setSavedIncludeInRss(inRss)
    setSavedCreativeCommons(cc)
  }, [settings])

  const isDirty = useMemo(
    () =>
      emailDisplay       !== savedEmailDisplay       ||
      customFeedTitle    !== savedCustomFeedTitle    ||
      category           !== savedCategory           ||
      statsPrefix        !== savedStatsPrefix        ||
      customAuthorName   !== savedCustomAuthorName   ||
      subscriberRedirect !== savedSubscriberRedirect ||
      explicitContent    !== savedExplicitContent    ||
      includeInRss       !== savedIncludeInRss       ||
      creativeCommons    !== savedCreativeCommons,
    [
      emailDisplay, customFeedTitle, category, statsPrefix,
      customAuthorName, subscriberRedirect, explicitContent,
      includeInRss, creativeCommons, savedEmailDisplay,
      savedCustomFeedTitle, savedCategory, savedStatsPrefix,
      savedCustomAuthorName, savedSubscriberRedirect,
      savedExplicitContent, savedIncludeInRss, savedCreativeCommons,
    ]
  )

  const handleSave = () => {
    updateSettings({
      rssEmailDisplayed:       emailDisplay,
      customFieldTitle:        customFeedTitle,
      category,
      statsServiceUrlPrefix:   statsPrefix,
      customAuthorName,
      subscriberRedirect,
      containsExplicitContent: explicitContent,
      includeInRssFeed:        includeInRss,
      creativeCommonsLicense:  creativeCommons,
    })

    setSavedEmailDisplay(emailDisplay)
    setSavedCustomFeedTitle(customFeedTitle)
    setSavedCategory(category)
    setSavedStatsPrefix(statsPrefix)
    setSavedCustomAuthorName(customAuthorName)
    setSavedSubscriberRedirect(subscriberRedirect)
    setSavedExplicitContent(explicitContent)
    setSavedIncludeInRss(includeInRss)
    setSavedCreativeCommons(creativeCommons)
  }

  const handleCancel = () => {
    setEmailDisplay(savedEmailDisplay)
    setCustomFeedTitle(savedCustomFeedTitle)
    setCategory(savedCategory)
    setStatsPrefix(savedStatsPrefix)
    setCustomAuthorName(savedCustomAuthorName)
    setSubscriberRedirect(savedSubscriberRedirect)
    setExplicitContent(savedExplicitContent)
    setIncludeInRss(savedIncludeInRss)
    setCreativeCommons(savedCreativeCommons)
  }

  if (loading) {
    return <div className="text-white-smoke/40 text-sm">Loading...</div>
  }

  return (
    <div className="w-full max-w-3xl text-white-smoke font-bold space-y-8 mb-10">

      {/* RSS feed */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg flex items-center gap-2">
            RSS feed
            <InfoPopover text={RSS_FEED_INFO} className="w-88" />
          </h1>

          <span
            className={`
              flex items-center gap-1.5 text-sm text-white-smoke/60
              transition-opacity duration-300
              ${saveStatus === "idle" ? "opacity-0" : "opacity-100"}
            `}
          >
            {saveStatus === "saving" && (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white-smoke/30 border-t-white-smoke/80 animate-spin inline-block" />
                Saving...
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <Check size={14} strokeWidth={2.5} />
                Changes saved
              </>
            )}
            {saveStatus === "error" && (
              <span className="text-red-400">Failed to save</span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-5">

          {/* Row 1 */}
          <div className="sm:col-span-2">
            <label className="text-sm mb-2 block">RSS feed</label>
            <TextInput value={rssFeed} readOnly />
          </div>
          <div>
            <label className="text-sm mb-2 block">Email address displayed</label>
            <Select
              value={emailDisplay}
              onChange={setEmailDisplay}
              options={EMAIL_OPTIONS}
              style={{ width: "100%", height: 32 }}
              className="notif-select"
              classNames={{ popup: { root: "notif-dropdown-popup" } }}
            />
          </div>

          {/* Row 2 */}
          <div>
            <label className="text-sm mb-2 block">Custom feed title</label>
            <TextInput value={customFeedTitle} onChange={setCustomFeedTitle} />
          </div>
          <div>
            <label className="text-sm mb-2 block">
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              value={category || undefined}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
              placeholder=" "
              style={{ width: "100%", height: 32 }}
              className="notif-select"
              classNames={{ popup: { root: "notif-dropdown-popup" } }}
            />
          </div>
          <div>
            <label className="text-sm mb-2 flex items-center gap-1.5">
              Stats-service URL prefix
              <InfoPopover text={STATS_INFO} className="w-90" />
            </label>
            <TextInput placeholder="http://" value={statsPrefix} onChange={setStatsPrefix} />
          </div>

          {/* Row 3 */}
          <div>
            <label className="text-sm mb-2 block">Custom author name</label>
            <TextInput value={customAuthorName} onChange={setCustomAuthorName} />
          </div>
          <div>
            <label className="text-sm mb-2 block">
              Language <span className="text-red-500">*</span>
            </label>
            <Select
              value="en"
              disabled
              options={LANGUAGE_OPTIONS}
              style={{ width: "100%", height: 32 }}
              className="notif-select"
              classNames={{ popup: { root: "notif-dropdown-popup" } }}
            />
          </div>
          <div>
            <label className="text-sm mb-2 flex items-center gap-1.5">
              Subscriber redirect
              <InfoPopover text={REDIRECT_INFO} className="w-76" />
            </label>
            <TextInput placeholder="http://" value={subscriberRedirect} onChange={setSubscriberRedirect} />
          </div>

        </div>

        <label className="flex items-center gap-3 cursor-pointer w-fit">
          <CB checked={explicitContent} onChange={setExplicitContent} />
          <span className="text-sm">Contains explicit content</span>
        </label>
      </div>

      {/* Upload Defaults */}
      <div>
        <h1 className="text-lg mb-5 flex items-center gap-2">
          Upload Defaults
          <InfoPopover text={UPLOAD_INFO} className="w-108" />
        </h1>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <CB checked={includeInRss} onChange={setIncludeInRss} />
            <span className="text-sm">Include in RSS feed</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <CB checked={creativeCommons} onChange={setCreativeCommons} />
            <span className="text-sm">Creative Commons license</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button onClick={handleCancel} className="text-white-smoke">
          Cancel
        </Button>
        <Button
          disabled={!isDirty || saveStatus === "saving"}
          onClick={handleSave}
          className="bg-white-smoke text-chinese-black disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saveStatus === "saving" ? "Saving..." : "Save changes"}
        </Button>
      </div>

    </div>
  )
}