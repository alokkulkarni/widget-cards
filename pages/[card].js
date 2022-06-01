export default function CardPage({ card }) {
    return (
       <h1>{card.title}</h1>
    )
}

export async function getStaticProps({ params }) {
    const { card } = params;

    const result = await fetch(`https://graphql.contentful.com/content/v1/spaces/gma4quc32grm/environments/master`,{
        method: `POST`,
        headers: {
            Authorization: `Bearer DrOaX91XAnJjeLYvsjxggaRYpaRNv4VKBHBWG13llm4`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            query getCard($slug: String!) {
                cardsCollection(where: {
                slug: $slug
                }, limit: 1) {
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
          variables: {
              slug: card
          }
        })
    });

    if (!result.ok) {
      console.error(result);
      return {}
    }

    const { data } = await result.json();
    const cardData = data.cardsCollection.items[0];


    return {
        props: {
            card: cardData
        }
    }
}

export async function getStaticPaths() {
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
                        slug
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
    const cardSlugs = data.cardsCollection.items;
    const paths = cardSlugs.map(({slug}) => {
        return {
            params: { card: slug }
        };
    });

    return {
       paths,
       fallback: false,
    }
}