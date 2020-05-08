import useSWR from 'swr';
import Fish from '../../components/Fish/Fish';
import Head from 'next/head';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function fish() {
  const { data, error } = useSWR('/api/fish', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="container">
      <Head>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
      </Head>

      <ul>
        {data.map((p, i) => (
          <Fish key={i} fish={p} />
        ))}
      </ul>
    </div>
  );
}
