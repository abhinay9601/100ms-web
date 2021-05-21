import {
  useHMSStore,
  ControlBar,
  HangUpIcon,
  TwButton,
  ShareScreenIcon,
  ChatIcon,
  VerticalDivider,
  selectLocalPeer,
  useHMSActions,
  selectLocalMediaSettings,
  selectIsLocalScreenShared,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
} from "@100mslive/sdk-components";
import { useContext } from "react";
import { AppContext } from "../store/AppContext";
import { useHistory } from "react-router-dom";
import {Settings} from "@100mslive/sdk-components";

const SettingsView = () => {
  const {maxTileCount, setMaxTileCount} = useContext(AppContext);
  const mediaSettings = useHMSStore(selectLocalMediaSettings);

  const selectedVideoInput = mediaSettings.videoInputDeviceId;
  const selectedAudioInput = mediaSettings.audioInputDeviceId;

  console.log(maxTileCount);
  const onChange = ({maxTileCount:newMaxTileCount, ...props}) => {
    setMaxTileCount(newMaxTileCount);
  }
  return (
    <>
          <Settings
          initialValues={{maxTileCount, selectedVideoInput, selectedAudioInput}}
          onChange={onChange}
        />                  
    </>
  )
}

export const ConferenceFooter = ({ isChatOpen, toggleChat }) => {
  const isScreenShared = useHMSStore(selectIsLocalScreenShared);
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);
  const hmsActions = useHMSActions();
  const { isConnected, leave } = useContext(AppContext);
  const history = useHistory();

  const toggleScreenShare = () => {
    if (isScreenShared) {
      hmsActions.stopScreenShare();
    } else {
      hmsActions.startScreenShare();
    }
  }

  return (
    <>
      {isConnected && (
        <ControlBar
          leftComponents={[
            <SettingsView key={0}/>,
            <VerticalDivider />,
            <TwButton
            iconOnly
            variant={'no-fill'}
            iconSize="md"
            shape={'rectangle'}
            onClick={toggleScreenShare}
            key={1}
          >
            <ShareScreenIcon />
          </TwButton>,
    <VerticalDivider />,
    <TwButton
            iconOnly
            variant={'no-fill'}
            iconSize='md'
            shape={'rectangle'}
            onClick={toggleChat}
            active={isChatOpen}
            key={2}
          >
            <ChatIcon />
          </TwButton>,      
          ]}
          rightComponents={[
            <TwButton
            size='md'
            shape={'rectangle'}
            variant={'danger'}
            onClick={() => {
              leave();
              history.push("/");
            }}
          >
              <HangUpIcon className="mr-2" />
              Leave room
          </TwButton>
          ]}
          audioButtonOnClick={() => hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled)}
          videoButtonOnClick={() => hmsActions.setLocalAudioEnabled(!isLocalVideoEnabled)}
          isAudioMuted={!isLocalAudioEnabled}
          isVideoMuted={!isLocalVideoEnabled}
        />
      )}
    </>
  );
};
