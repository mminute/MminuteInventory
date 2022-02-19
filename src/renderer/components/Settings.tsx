import { Box, Button, Checkbox, Divider, Flex, Module, Text } from 'gestalt';
import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

function Section({ children, title }: { children: ReactNode; title: string }) {
  return (
    <Flex direction="column" gap={2}>
      <Text size="md" weight="bold">
        {title}
      </Text>

      {children}
    </Flex>
  );
}

interface Props {
  filepath: string;
  fileSettings: { showArchived: boolean };
}

function Settings({ filepath, fileSettings }: Props) {
  const [animationClass, setAnimationClass] = useState('fade-in');
  const [showArchived, setShowArchived] = useState(fileSettings.showArchived);
  const [clearRecentFiles, setClearRecentFiles] = useState(false);
  const [clearAllFileSettings, setClearAllFileSettings] = useState(false);
  const [clearAllApplicationData, setClearAllApplicationData] = useState(false);
  const navigate = useNavigate();
  const goBack = () => {
    setAnimationClass('fade-out');
    setTimeout(() => navigate(-1), 250);
  };

  const pathParts = filepath.split('/'); // TODO: Handle linux and windows

  return (
    <div className={`settings-wrapper ${animationClass}`}>
      <Box
        height="100vh"
        padding={12}
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box width="65%">
          <Module id="setting-main" title="Settings">
            <Flex direction="column" gap={4}>
              <Section
                title={`File settings for: ${pathParts[pathParts.length - 1]}`}
              >
                <Flex direction="row" alignItems="center" gap={2}>
                  <Checkbox
                    id="archived-checkbox"
                    checked={clearAllApplicationData ? false : showArchived}
                    disabled={clearAllApplicationData}
                    onChange={({ checked }) => setShowArchived(checked)}
                  />
                  <Text>Show archived items</Text>
                </Flex>
              </Section>

              <Divider />

              <Section title="Application settings">
                <Flex direction="column" gap={2}>
                  <Flex direction="row" alignItems="center" gap={2}>
                    <Checkbox
                      id="clear-recent-checkbox"
                      checked={clearAllApplicationData || clearRecentFiles}
                      disabled={clearAllApplicationData}
                      onChange={({ checked }) => setClearRecentFiles(checked)}
                    />
                    <Text>Clear recent files</Text>
                  </Flex>

                  <Flex direction="row" alignItems="center" gap={2}>
                    <Checkbox
                      id="clear-all-file-settings"
                      checked={clearAllApplicationData || clearAllFileSettings}
                      disabled={clearAllApplicationData}
                      onChange={({ checked }) =>
                        setClearAllFileSettings(checked)
                      }
                    />
                    <Text>Clear settings for all files</Text>
                  </Flex>

                  <Flex direction="row" alignItems="center" gap={2}>
                    <Checkbox
                      id="clear-application-data"
                      checked={clearAllApplicationData}
                      onChange={({ checked }) =>
                        setClearAllApplicationData(checked)
                      }
                    />
                    <Text>Clear all application data</Text>
                  </Flex>
                </Flex>
              </Section>
            </Flex>

            <Box marginTop={12} width="100%">
              <Flex direction="row" gap={2} justifyContent="end">
                <Button text="Cancel" onClick={goBack} />

                <Button
                  text="Save"
                  color="blue"
                  onClick={() => {
                    window.electron.ipcRenderer.updateSettings({
                      showArchived,
                      clearRecentFiles,
                      clearAllFileSettings,
                      clearAllApplicationData,
                    });
                    goBack();
                  }}
                />
              </Flex>
            </Box>
          </Module>
        </Box>
      </Box>
    </div>
  );
}

export default Settings;
