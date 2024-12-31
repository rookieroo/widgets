import {useState} from "react";
import {useTranslation} from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type Confirm = {
  title: string;
  message: string;
  onConfirm: () => Promise<void> | void;
}

export type Alert = {
  message: string;
  onConfirm: () => void;
}

export type ShowAlertType = (msg: string, onConfirm?: () => (Promise<void> | void)) => void;

export function useAlert() {
  const [alert, setAlert] = useState<Alert | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const close = () => {
    alert?.onConfirm()
    setIsOpen(false)
    setAlert(null)
  }
  const showAlert = (alert: string, onConfirm?: () => void) => {
    setAlert({
      message: alert,
      onConfirm: onConfirm ?? (() => {
      })
    })
    setIsOpen(true)
  }
  const {t} = useTranslation()
  const AlertUI = () => (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("alert")}</AlertDialogTitle>
          <AlertDialogDescription>
            {alert?.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setIsOpen(false)}>{t('confirm')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
  return {showAlert, close, AlertUI}
}

export function useConfirm() {
  const [confirm, setConfirm] = useState<Confirm | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const close = () => {
    setConfirm(null)
    setIsOpen(false)
  }
  const showConfirm = (title: string, message: string, onConfirm?: () => Promise<void> | void) => {
    setConfirm({
      title,
      message,
      onConfirm: onConfirm ?? (() => {
      })
    })
    setIsOpen(true)
  }
  const {t} = useTranslation()
  const ConfirmUI = () => (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {confirm?.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {confirm?.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={close}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              setLoading(true);
              await confirm?.onConfirm();
              setLoading(false);
              setIsOpen(false);
            }}
          >
            {t('confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
  return {showConfirm, close, ConfirmUI}
}