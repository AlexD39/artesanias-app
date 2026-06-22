import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getPublicSettings, getPublicSocialLinks } from "../services/api";
import type { SocialLink, StoreSettings } from "../types/settings";

type SiteContextValue = {
  settings: StoreSettings | null;
  socialLinks: SocialLink[];
  loading: boolean;
};

const SiteContext = createContext<SiteContextValue>({
  settings: null,
  socialLinks: [],
  loading: true,
});

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSiteData() {
      try {
        const [settingsData, socialLinksData] = await Promise.all([
          getPublicSettings(),
          getPublicSocialLinks(),
        ]);

        setSettings(settingsData);
        setSocialLinks(socialLinksData);
      } catch {
        setSettings(null);
        setSocialLinks([]);
      } finally {
        setLoading(false);
      }
    }

    loadSiteData();
  }, []);

  return (
    <SiteContext.Provider value={{ settings, socialLinks, loading }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}