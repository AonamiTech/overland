import { Twitter, Linkedin, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "@/components/ui/BrandLogo";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string, external = false) => {
    if (external) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  const columns = [
    {
      title: "Services",
      links: [
        { label: "Insurance", path: "/insurance" },
        { label: "Broker dashboard", path: "/broker/dashboard" },
        { label: "Fleet dashboard", path: "/fleet/dashboard" },
        { label: "Corporate dashboard", path: "/corporate/dashboard" },
      ],
    },
    {
      title: "Platform",
      links: [
        { label: "Post loads", path: "/post-loads" },
        { label: "Hire trucks", path: "/hire-trucks" },
        { label: "Post a truck", path: "/post-truck" },
        { label: "Live bidding", path: "/bidding" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help center", path: "/" },
        { label: "FAQ", path: "/" },
        { label: "Terms of service", path: "/" },
        { label: "Privacy policy", path: "/" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0D0D11] pt-16 pb-10 text-white">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* brand */}
          <div>
            <button onClick={() => handleNavigation('/')} className="mb-4">
              <BrandLogo height={30} tone="light" />
            </button>
            <p className="max-w-xs font-poppins text-[14px] leading-relaxed text-[#9A9AA3]">
              America's real-time freight exchange. Carriers, transparent rates, coast to coast.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { Icon: Twitter, url: 'https://twitter.com/OverlandOfficial' },
                { Icon: Linkedin, url: 'https://linkedin.com/company/Overland' },
                { Icon: Instagram, url: 'https://instagram.com/Overland' },
              ].map(({ Icon, url }, i) => (
                <button
                  key={i}
                  onClick={() => handleNavigation(url, true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-[#9A9AA3] transition-colors hover:border-white/30 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="ov-num text-[11px] font-semibold uppercase tracking-[0.14em] text-[#63636E]">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNavigation(link.path)}
                      className="font-poppins text-[14px] text-[#B4B4BC] transition-colors hover:text-white"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <p className="ov-num text-[12px] text-[#63636E]">© 2025 Overland Technologies, Inc. All rights reserved.</p>
          <p className="ov-num text-[12px] text-[#63636E]">Built for the interstate.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
