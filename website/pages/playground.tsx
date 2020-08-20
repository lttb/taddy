import dynamic from 'next/dynamic';

const Playground = dynamic(() => import('../components/playground'), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

export default function PlaygroundPage() {
    return (
        <>
            <Playground />
        </>
    );
}
