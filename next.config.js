switch (process.env.PROD) {
  case "uat":
    require("dotenv").config({
      path: `.env.uat`,
    });
    break;
  case "prod":
    require("dotenv").config({
      path: `.env.prod`,
    });
    break;
}

module.exports = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qa-online.carrefour.com.tw",
        port: "",
        pathname:
          "/on/demandware.static/-/Sites-carrefour-tw-m-inner/default/images/**",
      },
      {
        protocol: "https",
        hostname: "qa-online.carrefour.com.tw",
        port: "",
        pathname: "/on/demandware.static/**",
      },
    ],
  },
};
