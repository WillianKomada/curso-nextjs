import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Title } from '@/styles/pages/Home';
import SEO from '@/components/SEO';
import { client } from '@/lib/prismic';
import Prismic from 'prismic-javascript';
import PrismicDom from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';



interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: HomeProps) {
  return (
    <div>
      <SEO 
        title="DevCommerce, your best e-commerce!"
        image="boost.png"
        shouldExcludeTitleSuffix 
      />

      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                <Link href={`/catalog/products/${recommendedProduct.uid}`}>
                  <a>
                    {PrismicDom.RichText.asText(recommendedProduct.data.title)}                
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ]);

  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    }
  }
}

/**
 * GetServerSideProps não deve ser utilizado sempre.
 * Apenas quando é necessário o carregamento de uma API de imediato, 
 * por exemplo: Uma listagem de produtos.
 * 
 * Por que isso ajuda na indexagem do site, ou seja, o motor de busca
 * do google, vai identificar os produtos a serem listados. E não
 * uma tela vazia que ainda está renderizando ou consultando a API.
 * 
 * CLIENT SIDE RENDERING === CODAR UMA API DENTRO DO COMPONENTE 
 * (useEffect)
 * SERVER SIDE RENDERING === CODAR UMA API FORA DO COMPONENTE 
 * (GetServerSideProps)
 * STATIC SIDE GENERATION === CODAR UMA API FORA DO COMPONENTE
 * (GetStaticProps)
 * 
 * CSR => Faz uma chamada a API dentro do componente, isso leva tempo
 * para renderizar no browser que faz o motor de busca não identificar 
 * o SEO.
 * SSR => Faz uma chamada a API fora do componente, isso leva tempo, 
 * porém performa o componente renderizando no browser. 
 * Tem suporte ao SEO.
 * SSG => Faz uma chamada a API fora do componente, renderizar no 
 * browser instantaneamente e possibilita a atualização 
 * (chamadas a API) em um tempo definido.
 */