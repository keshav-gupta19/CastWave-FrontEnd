import styled from "styled-components";

/* eslint-disable react/prop-types */
const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.text_primary};
`;
const SelectInput = styled.select`
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.bgLight};
  border-radius: 100px;
  color: ${({ theme }) => theme.text_primary};
`;
const Option = styled.option`
  background-color: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.text_primary};
`;
const ThemeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px 0px;
`;
const ThemeComponent = ({ selectedTheme, handleThemeChange }) => {
  const themeOptions = [
    "light",
    "dark",
    "MidnightHorizon",
    "OceanBreeze",
    "DesertMirage",
    "EnchantedForest",
    "RubyElegance",
    "GalacticNebula",
    "SunsetSerenity",
    "MysticAurora",
    "VintageCharm",
    "CyberFusion",
    "CelestialHarmony",
    "TwilightReverie",
  ];
  return (
    <div>
      <ThemeWrapper>
        <Label htmlFor="themeComponent"></Label>
        <SelectInput
          id="themeComponent"
          value={selectedTheme}
          onChange={(e) => {
            handleThemeChange(e.target.value);
          }}
        >
          {themeOptions.map((theme) => (
            <Option key={theme} value={theme}>
              {theme}
            </Option>
          ))}
        </SelectInput>
      </ThemeWrapper>
    </div>
  );
};

export default ThemeComponent;
