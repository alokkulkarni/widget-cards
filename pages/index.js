import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useScroll } from "react-use-gesture";
// import { motion, useAnimation } from "framer-motion";
import { animated, useSpring } from "react-spring";
import styles from '../styles/Home.module.css'


const clamp = (value, clampAt = 30) => {
  if (value > 0) {
    return value > clampAt ? clampAt : value;
  } else {
    return value < -clampAt ? -clampAt : value;
  }
};

export default function Home({ cards }) {

  const [style, set] = useSpring(() => ({
    transform: "perspective(500px) rotateY(0deg)"
  }));
  
  // const controls = useAnimation();
  // const bind = useScroll(event => {
  //   controls.start({
  //     transform: `perspective(500px) rotateY(${
  //       event.scrolling ? clamp(event.delta[0]) : 0
  //     }deg)`
  //   });
  // });
  const bind = useScroll(event => {
    set({
      transform: `perspective(500px) rotateY(${
        event.scrolling ? clamp(event.delta[0]) : 0
      }deg)`
    });
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Widget Cards</title>
        <meta name="description" content="Generated by Alok Kulkarni" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Widgets!</a>
        </h1>

        <div className={styles.containerscroll} {...bind()}>
          {cards.map((card , index) => (
            <animated.div
              key={index}
              className={styles.card}
              style={{
                ...style,
                backgroundImage: `url("/white.jpeg")`
              }}
            >
                <Link href={`/${card.slug}`}>
                  <a>
                  <div style={{borderRadius: '5px', overflow: 'hidden'}}>
                      <Image
                        src={card.cardThumbnail.url}
                        alt="Picture of the author"
                        width={50}
                        height={50}
                        className={styles.makeImageCircular}
                      />
                    </div>
                    <h2>{card.title}</h2>
                    <p>{card.cardSubTitle}</p>
                  </a>
                </Link>
            </animated.div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> 
    </div>
  )
}

export async function getStaticProps() {

    const result = await fetch(`https://graphql.contentful.com/content/v1/spaces/gma4quc32grm/environments/master`,{
        method: `POST`,
        headers: {
            Authorization: `Bearer DrOaX91XAnJjeLYvsjxggaRYpaRNv4VKBHBWG13llm4`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            query getAllCards {
              cardsCollection(order: [cardCategory_ASC, id_ASC]) {
                items {
                  id
                  title
                  slug
                  cardSubTitle
                  cardCategory
                  cardThumbnail {
                    url
                  }
                  cardBackgroundColor
                  cardActionUrl
                  cardShow
                }
              }
            }
          `,
        })
    });

    if (!result.ok) {
      console.error(result);
      return {}
    }
    
    const { data } = await result.json();
    const cards = data.cardsCollection.items;

  return {
    props: {
      cards,
    }
  }
}



{/* <div className={styles.grid}>
          {cards.map((card, index) => (
              <div key={index} className={styles.card}>
                <Link href={`/${card.slug}`}>
                  <a>
                  <div style={{borderRadius: '5px', overflow: 'hidden'}}>
                      <Image
                        src={card.cardThumbnail.url}
                        alt="Picture of the author"
                        width={50}
                        height={50}
                        className={styles.makeImageCircular}
                      />
                    </div>
                    <h2>{card.title}</h2>
                    <p>{card.cardSubTitle}</p>
                  </a>
                </Link>
              </div>
            ))}
        </div> */}