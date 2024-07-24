import {useContext, useEffect, useState} from 'react';
import Popup from 'reactjs-popup';
import {ClientConfigContext} from '../state/config';
import {Helmet} from "react-helmet";
import {siteName} from '../utils/constants';
import {useTranslation} from "react-i18next";
import {useConfig} from "../store/useConfig";
import useToggleMode from "../hooks/use-toggle-mode";

type ThemeMode = 'light' | 'dark' | 'system';

function Footer() {
  const [config, setConfig] = useConfig();
  const {t} = useTranslation();
  const conf = useContext(ClientConfigContext);
  const footerHtml = conf.get<string>('footer');
  useToggleMode(config);

  const setMode = (mode: ThemeMode) => {
    setConfig({
      ...config,
      mode: mode
    })
  }

  return (
    <footer>
      <Helmet>
        <link rel="alternate" type="application/rss+xml" title={siteName} href="/sub/rss.xml"/>
        <link rel="alternate" type="application/atom+xml" title={siteName} href="/sub/atom.xml"/>
        <link rel="alternate" type="application/json" title={siteName} href="/sub/rss.json"/>
      </Helmet>
      <div className="flex flex-col mb-8 space-y-2 justify-center items-center t-primary ani-show">
        {footerHtml && <div dangerouslySetInnerHTML={{__html: footerHtml}}/>}
        <p className='text-sm text-neutral-500 font-normal link-line'>
                    <span>
                        © 2024 Powered by <a className='hover:underline' href="https://github.com/openRin/Rin"
                                             target="_blank">Rin</a>
                    </span>
          {conf.get<boolean>('rss') && <>
            <Spliter/>
            <Popup trigger={
              <button className="hover:underline" type="button">
                RSS
              </button>
            }
                   position="top center"
                   arrow={false}
                   closeOnDocumentClick>
              <div className="border-card">
                <p className='font-bold t-primary'>
                  {t('footer.rss')}
                </p>
                <p>
                  <a href='/sub/rss.xml'>
                    RSS
                  </a> <Spliter/>
                  <a href='/sub/atom.xml'>
                    Atom
                  </a> <Spliter/>
                  <a href='/sub/rss.json'>
                    JSON
                  </a>
                </p>

              </div>
            </Popup>
          </>}
        </p>
        <div className="w-fit-content inline-flex rounded-full border border-zinc-200 p-[3px] dark:border-zinc-700">
          <ThemeButton mode='light' current={config.mode} label="Toggle light mode" icon="ri-sun-line" onClick={setMode}/>
          <ThemeButton mode='system' current={config.mode} label="Toggle system mode" icon="ri-computer-line"
                       onClick={setMode}/>
          <ThemeButton mode='dark' current={config.mode} label="Toggle dark mode" icon="ri-moon-line" onClick={setMode}/>
        </div>
      </div>
    </footer>
  );
}

function Spliter() {
  return (<span className='px-1'>
        |
    </span>
  )
}

function ThemeButton({
                       current,
                       mode,
                       label,
                       icon,
                       onClick
                     }: { current: ThemeMode, label: string, mode: ThemeMode, icon: string, onClick: (mode: ThemeMode) => void }) {
  return (<button aria-label={label} type="button" onClick={() => onClick(mode)}
                  className={`rounded-inherit inline-flex h-[32px] w-[32px] items-center justify-center border-0 ${current === mode ? "text-primary rounded-full shadow-xl shadow-light" : ""}`}>
    <i className={`${icon}`}/>
  </button>)
}

export default Footer;