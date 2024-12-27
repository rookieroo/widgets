import {ExposeParam, MdEditor, Footers} from "md-editor-rt";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {toolbars, codeThemeOptions, previewThemeOptions} from "./config";
import {Emoji, ExportPDF, Mark} from "@vavt/rt-extension";
import i18n from 'i18next';
import {useTranslation} from "react-i18next";
import {useConfig} from "../../store/useConfig";
import {TimeNow} from "../time-now";
import {client} from "../../main";
import {headersWithAuth} from "../../utils/auth";
import useIsMobile from "../../hooks/use-is-mobile";
import {Helmet} from "react-helmet";
import 'md-editor-rt/lib/style.css';
import {YoutubeEmbed} from "./youtube-embed";

interface IMdEditorState {
  lang?: string;
  md?: string;
  theme?: "light" | "dark";
  previewTheme?:
    | "default"
    | "github"
    | "vuepress"
    | "mk-cute"
    | "smart-blue"
    | "cyanosis"
    | "arknights";
  codeTheme?:
    | "atom"
    | "a11y"
    | "github"
    | "gradient"
    | "kimbie"
    | "paraiso"
    | "qtcreator"
    | "stackoverflow";
}

const editorId = 'editor-preview';

export default function MdEditorExV5({ mdText, onContentChange }: { mdText: string; onContentChange: (val: string) => void }) {
  const [config] = useConfig();
  const {t, i18n} = useTranslation();
  const editorRef = useRef<ExposeParam>();
  const [md, setMd] = useState(mdText||"");
  const isMobile = useIsMobile();

  const [state, setState] = useState({
    lang: i18n.language === "en" ? "en-US" : i18n.language,
    md: "",
    theme: config?.mode || 'light',
    codeTheme: "",
    previewTheme: "",
  });
  const [isDebug, setIsDebug] = useState(() => {
    return false;
  });
  const [ufToolbars, setToolbars] = useState(toolbars);
  const [inputBoxWidth, setInputBoxWidth] = useState('50%');

  const { SITE_NAME, KEYWORDS, DESCRIPTION } = useMemo(() => {
    return {
      SITE_NAME: `prop's blog`,
      KEYWORDS: 'md',
      DESCRIPTION: 'writing md',
    };
  }, []);

  const changeLayout = useCallback(() => {
    if (isMobile) {
      // 在移动端不现实分屏预览，要么编辑，要么仅预览
      setToolbars(() => {
        const t = toolbars.filter(
          (item) =>
            !(['preview', 'previewOnly'] as Array<string | number>).includes(
              item
            )
        );

        return ['previewOnly', ...t];
      });
      setInputBoxWidth('100%');
      editorRef.current?.togglePreview(false);
    } else {
      setToolbars(toolbars);
      setInputBoxWidth('50%');
      editorRef.current?.togglePreview(true);
    }
  }, [isMobile]);

  useEffect(() => {
    setState({
      ...state,
      theme: config?.mode,
      lang: i18n.language === "en" ? "en-US" : i18n.language,
    });
  }, [i18n.language, config?.mode]);

  let closrRatio = () => {};
  let updateRatio: ((str: string) => void) | undefined;

  const onProgress = ({ ratio }: { ratio: number }) => {
    if (updateRatio) {
      updateRatio(`Progress: ${ratio * 100}%`);
    } else {
    //  `Progress: ${ratio * 100}%`
    }
  };

  const onSuccess = () => {
    closrRatio();

    setTimeout(() => {
      updateRatio = undefined;
    }, 100);

    // message.success('Export successful.', {
    //   zIndex: 999999,
    // });
  };

  const PreviewTheme = () => {
    return (
      <>
        <select
          value={state.previewTheme}
          onChange={(event) => {
            setState({
              ...state,
              previewTheme: event.target
                .value as IMdEditorState["previewTheme"],
            });
          }}
        >
          {previewThemeOptions.map((preview) => (
            <option key={preview.value} value={preview.value}>
              {preview.label}
            </option>
          ))}
        </select>
      </>
    );
  };

  const CodeTheme = () => {
    return (
      <>
        <select
          value={state.codeTheme}
          onChange={(event) => {
            setState({
              ...state,
              codeTheme: event.target.value as IMdEditorState["codeTheme"],
            });
          }}
        >
          {codeThemeOptions.map((code) => (
            <option key={code.value} value={code.value}>
              {code.label}
            </option>
          ))}
        </select>
      </>
    );
  };

  const onUploadImg = async (files, callback) => {
    const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          client.storage.index
            .post(
              {
                key: file.name,
                file: file,
              },
              {
                headers: headersWithAuth(),
              }
            )
            .then(({data, error}) => {
              if (error) {
                rej(error)
              }
              if (data) {
                rev(data);
              }
            })
            .catch((e: any) => {
              rej(e)
            });
        });
      })
    );

    callback(res.map((item) => item));

  };

  useEffect(() => {
    if (isDebug) {
      editorRef.current?.on('catalog', (v) => {
        console.log('catalog', v);
      });
      editorRef.current?.on('fullscreen', (v) => {
        console.log('fullscreen', v);
      });
      editorRef.current?.on('htmlPreview', (v) => {
        console.log('htmlPreview', v);
      });
      editorRef.current?.on('pageFullscreen', (v) => {
        console.log('pageFullscreen', v);
      });
      editorRef.current?.on('preview', (v) => {
        console.log('preview', v);
      });

      // window.editorInstance = editorRef.current;
    }

    editorRef.current?.on('previewOnly', (v) => {
      if (isMobile) {
        if (!v) {
          editorRef.current?.togglePreview(false);
        }
      }
    });

    changeLayout();

    window.addEventListener('resize', changeLayout);
  }, [changeLayout, isDebug]);

  const footers: Footers[] = ['markdownTotal', '=', 0, 'scrollSwitch'];

  const defFooters = useMemo(() => {
    return [<TimeNow key="time-now" />];
  }, []);

  const onSave = useCallback((v: string, h: Promise<string>) => {
    console.log('v', v);

    h.then((html) => {
      console.log('h', html);
    });
  }, []);

  return (
    <div className="h-screen w-full relative z-1">
      <Helmet>
        <title>{SITE_NAME}</title>
        <meta name="keywords" content={KEYWORDS} />
        <meta name="description" content={DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <MdEditor
        language={state?.lang}
        ref={editorRef}
        theme={state?.theme}
        previewTheme={state?.previewTheme}
        inputBoxWidth={inputBoxWidth}
        codeTheme={state?.codeTheme}
        value={md}
        id={editorId}
        autoDetectCode
        defToolbars={[
          <Mark key="mark-extension" />,
          <Emoji key="emoji-extension" />,
          <ExportPDF
            key="ExportPDF"
            modelValue={md}
            height="700px"
            onProgress={onProgress}
            onSuccess={onSuccess}
          />,
          <YoutubeEmbed key="youtube-embed"/>,
          <CodeTheme key="code-theme"/>,
          <PreviewTheme key="preview-theme"/>,
        ]}
        onSave={onSave}
        toolbars={ufToolbars}
        onChange={val => {
          setMd(val);
          onContentChange(val);
        }}
        onUploadImg={onUploadImg}
        footers={footers}
        defFooters={defFooters}
      />
    </div>
  );
}
