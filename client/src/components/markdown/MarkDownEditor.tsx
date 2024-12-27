import {ExposeParam, MdEditor} from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import {useEffect, useRef, useState} from "react";
import {toolbars, codeThemeOptions, previewThemeOptions} from "./config";
import {Emoji, ExportPDF, Mark} from "@vavt/rt-extension";
import i18n from 'i18next';
import "@vavt/rt-extension/lib/asset/style.css";
import {useTranslation} from "react-i18next";
import {useConfig} from "../../store/useConfig";
import {TimeNow} from "../time-now";
import {client} from "../../main";
import {headersWithAuth} from "../../utils/auth";
import useIsMobile from "../../hooks/use-is-mobile";

interface IMdEditorState {
  lang?: string;
  text?: string;
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

export default function MdEditorEx({text, theme, previewTheme, codeTheme, onContentChange}) {
  const [config] = useConfig();
  const {t, i18n} = useTranslation();
  const editorRef = useRef<ExposeParam>();

  const initState = {
    lang: i18n.language as string,
    text: "",
    theme: config?.mode || 'light',
    codeTheme: "atom",
    previewTheme: "default",
  };

  const [state, setState] = useState(initState);

  useEffect(() => {
    setState({
      ...state,
      theme: config?.mode,
      text: t("mdText", {ns: "markdown"}),
    });
  }, [i18n.language, config?.mode]);

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

    // Approach 1
    callback(res.map((item) => item));
    // Approach 2
    // callback(
    //   res.map((item: any) => ({
    //     url: item.data.url,
    //     alt: 'alt',
    //     title: 'title'
    //   }))
    // );
  };

  return (
    <div className="h-screen w-full relative z-1">
      <MdEditor
        ref={editorRef}
        value={text}
        theme={theme}
        onUploadImg={onUploadImg}
        onChange={onContentChange}
        language={i18n.language === "en" ? "en-US" : i18n.language}
        previewTheme={previewTheme}
        codeTheme={codeTheme}
        toolbars={toolbars}
        defToolbars={[
          <Emoji theme={theme} key={1}/>,
          <Mark key={2}/>,
          <ExportPDF key={3} modelValue={text} height="100vh"/>,
          <CodeTheme key={4}/>,
          <PreviewTheme key={5}/>,
        ]}
        defFooters={[<TimeNow key={1}/>]}
        autoDetectCode={true}
        footers={["markdownTotal", "=", 0, "scrollSwitch"]}
      />
    </div>
  );
}
