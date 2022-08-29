import Head from "next/head";

export const Meta = ({title}) => {
  return (
    <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
  )
}

Meta.defaultProps={
    title:"HaperJob"
}