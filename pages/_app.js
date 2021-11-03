import React from 'react'
import Header from '../components/head'
import Layout from '../components/main'
import { config } from '../next-seo.config'
import { DefaultSeo } from 'next-seo'
import '../amplifyConfig'
import '../styles/reset.css'

const Website = ({ Component, pageProps, router }) => {
  return (
    <>
      <DefaultSeo {...config} />
      <Header />
      <Layout router={router}>
        <Component {...pageProps} key={router.route} />
      </Layout>
    </>
  )
}

export default Website
