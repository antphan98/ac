import fetch from 'node-fetch';
import { useState, useEffect } from 'react';
import { Container, Header, Image, Grid } from 'semantic-ui-react';

function Articles() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then(
        (response) => {
          setIsLoaded(true);
          setResults(response.results);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return null;
  } else {
    return (
      // <div>
      //   <Grid columns="equal">
      //     <Grid.Row>
      //       <Grid.Column>
      //         {results.map((result) => (
      //           <Segment key={result}>
      //             <Card>
      //               <Card.Content>
      //                 <Card.Header key={result.title}>
      //                   {result.title}
      //                 </Card.Header>
      //                 <Card.Meta>
      //                   <span>Written by: {result.authors}</span>
      //                 </Card.Meta>
      //                 <Image
      //                   key={result.image_square_small}
      //                   src={result.image.square_small}
      //                 />
      //               </Card.Content>
      //             </Card>
      //           </Segment>
      //         ))}
      //       </Grid.Column>
      //     </Grid.Row>
      //   </Grid>
      // </div>
      <div className="parent">
        <Container>
          {results.map((result) => (
            <Grid celled key={result}>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Image src={result.image.original} />
                </Grid.Column>

                <Grid.Column width={13}>
                  <Header>{result.title}</Header>
                  <span>Written by: {result.authors}</span>
                  <p>Publish date: {result.publish_date}</p>
                  <p>{result.deck}</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          ))}
        </Container>
      </div>
    );
  }
}

export default Articles;
