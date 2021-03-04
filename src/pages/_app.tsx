import GlobalStyle from "@/styles/GlobalStyle";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}

// Rodar servidor node
// npx json-server server.json -p 3333 -w -d 2000
