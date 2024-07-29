import { t } from "i18next";
import { Button } from "primereact/button";
import { useCallback, useState } from "react";
import ReactModal from "react-modal";
import { Icon } from "../components/icon";
import { Input } from "../components/input";
import {google_oauth_url, oauth_url} from "../main";
import {Chrome} from "lucide-react";
import * as React from "react";
import {useGoogleLogin} from "@react-oauth/google";

export function useLoginModal(onClose?: () => void) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isOpened, setIsOpened] = useState(false);
    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            console.log(tokenResponse);
            // const realUserData = getDecodedOAuthJwtGoogle(tokenResponse?.access_token)
            // console.log(realUserData);
        },
    });

    const onLogin = useCallback(() => {
        setTimeout(() => {
            setIsOpened(false)
            onClose?.()
        }, 100)
    }, [username, password])
    const LoginModal = useCallback(() => {
        return (
            <ReactModal
                isOpen={isOpened}
                style={{
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        padding: "0",
                        border: "none",
                        borderRadius: "16px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "none",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1000,
                    },
                }}
                onRequestClose={() => setIsOpened(false)}
            >
                <div className="bg-w w-full flex flex-col items-center justify-between p-4 space-y-2 t-primary min-w-64">
                    <p className="text-xl">{t('login.title')}</p>
                    {false && <>
                        <Input value={username} setValue={setUsername} placeholder={t('login.username.placeholder')}
                            autofocus
                        />
                        <Input value={password} setValue={setPassword} placeholder={t('login.password.placeholder')}
                            autofocus
                            onSubmit={onLogin} />
                        <div className="flex flex-row items-center space-x-4">
                            <Button title={t("login.title")} onClick={onLogin} />
                        </div>
                    </>
                    }
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <p className="text-xs t-secondary">{t('login.oauth_only')}</p>
                        <div className="flex flex-row items-center space-x-4">
                            <Icon label={t('github_login')} name="ri-github-line" onClick={() => {
                                window.location.href = `${oauth_url}`
                            }} hover={true} />
                            <Button
                              variant="ghost"
                              // onClick={() => {window.location.href = `${google_oauth_url}`}}
                              onClick={login}
                              className="flex rounded-full border dark:border-grey-600 px-2 aspect-[1] items-center justify-center t-primary bg-button"
                            >
                                <Chrome className="h-4 w-4 dark:text-white" />
                                <span className="sr-only">Sign in with Google 🚀</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </ReactModal>
        )
    }, [username, password, isOpened, onLogin])
    return { LoginModal, setIsOpened }
}