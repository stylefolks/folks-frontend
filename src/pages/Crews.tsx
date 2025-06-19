import { Helmet } from 'react-helmet-async';

export default function CrewsPage() {
  return (
    <>
      <Helmet>
        <title>Crews | Stylefolks</title>
        <meta name="description" content="List of crews" />
      </Helmet>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Crews</h1>
        {/* TODO: crews list */}
      </div>
    </>
  );
}
