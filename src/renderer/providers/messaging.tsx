import React, { useState, useContext, useCallback, ReactNode } from 'react';
import Messaging from 'renderer/components/messaging/Messaging';

interface MessagingContextData {
  handleClose(): void;
  handleOpen(message: string, action?: CallbackFunction, options?: Options | null): void;
}

export interface Options {
  marginTop: number;
}

export const MessagingContext = React.createContext({} as MessagingContextData);

export type CallbackFunction = () => void;
let action: CallbackFunction | null = null;

interface MessagingProviderProps {
  children: ReactNode;
}

const MessagingProvider: React.FC<MessagingProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [options, setOptions] = useState<Options | null>(null);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpen = useCallback(
    (_message: string, actionParam: null | CallbackFunction = null, optionParam: Options | null = null) => {
      setOptions(optionParam);

      if (open) {
        setOpen(false);
        setTimeout(() => {
          action = actionParam;
          setMessage(_message);
          setOpen(true);
        }, 350);
      } else {
        action = actionParam;
        setMessage(_message);
        setOpen(true);
      }
    },
    [open]
  );

  function handleAction() {
    if (action) {
      action();
      setOpen(false);
    }
  }

  return (
    <MessagingContext.Provider
      value={{
        handleClose,
        handleOpen,
      }}
    >
      {children}
      <Messaging message={message} options={options} action={action} handleAction={handleAction} open={open} />
    </MessagingContext.Provider>
  );
};

export function useMessaging(): MessagingContextData {
  const context = useContext(MessagingContext);

  if (!context) throw new Error('This hook must be in Messaging Context Component');

  return context;
}

export default MessagingProvider;
