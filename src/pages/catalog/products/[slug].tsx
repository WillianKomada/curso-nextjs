import { client } from '@/lib/prismic';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router'
import Prismic from 'prismic-javascript';
import PrismicDom from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';

interface ProductProps {
  product: Document;
}

export default function Product({ product }: ProductProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>
        {PrismicDom.RichText.asText(product.data.title)}  
      </h1>

      <img src={product.data.thumbnail.url} width="600" alt=""/>

      <div dangerouslySetInnerHTML={{ __html: PrismicDom.RichText.asHtml(product.data.description) }} />

      <p>Price: ${product.data.price}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true, // Utiliza-se quando não foi feito o build da página estática
  }
}

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params;

  const product = await client().getByUID('product', String(slug), {});

  return{
    props: {
      product,
    },
    revalidate: 5,
  }
}