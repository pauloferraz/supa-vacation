import { AuthModal, Header } from '@/components';
import Head from 'next/head';
import { useState } from 'react';

const Layout = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <Head>
        <title>SupaVacation | The Modern Dev</title>
        <meta
          name='title'
          content='Learn how to Build a Fullstack App with Next.js, PlanetScale & Prisma | The Modern Dev'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='min-h-screen flex flex-col'>
        <Header openModal={openModal} />

        <main className='flex-grow container mx-auto'>
          <div className='px-4 py-12'>
            {typeof children === 'function' ? children(openModal) : children}
          </div>
        </main>

        <AuthModal show={showModal} onClose={closeModal} />
      </div>
    </>
  );
};

export default Layout;
