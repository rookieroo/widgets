import {useEffect, useState} from "react"
import {Helmet} from 'react-helmet'
import {Waiting} from "../components/loading"
import {client} from "../main"
import {siteName} from "../utils/constants"
import {useTranslation} from "react-i18next";
import ColorExtractor from "../components/color/color-extractor";
import ColorMap from "../components/color/color-map";
import MdEditorEx from "../components/markdown/MarkDownEditor";

export function MDEditor() {
  const [url, setUrl] = useState("https://image.useone.online/images/68f44d618d69c5304702fce09dc12cb018c195a7.jpg")
  const {t} = useTranslation()

  const onFileChange = (e) => {
    const _files = e.target.files;

    if (_files.length) {
      const url = URL.createObjectURL(_files[0]);
      _files[0].url = url;
      setUrl(url);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${t('timeline')} - ${process.env.NAME}`}</title>
        <meta property="og:site_name" content={siteName}/>
        <meta property="og:title" content={t('timeline')}/>
        <meta property="og:image" content={process.env.AVATAR}/>
        <meta property="og:type" content="article"/>
        <meta property="og:url" content={document.URL}/>
      </Helmet>
        <main className="w-full flex flex-col justify-center items-center mb-8 ani-show dark:text-white">
          <MdEditorEx />
        </main>
    </>
  )
}