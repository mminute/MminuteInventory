import { useState } from 'react';
import { ComboBox, Tag } from 'gestalt';

interface Props {
  comboBoxLabel: string;
  onSelection: (selected: Array<string>) => void;
  placeholder: string;
  rawOptions: Array<string>;
  selectedOptions: Array<string>;
}

function TagComboBox({
  comboBoxLabel,
  onSelection,
  placeholder,
  rawOptions,
  selectedOptions,
}: Props) {
  const options = rawOptions.map((option) => ({
    label: option,
    value: option,
  }));

  const [defaultOption, setDefaultOption] = useState('');
  const [selected, setSelected] = useState<Array<string>>(selectedOptions);
  const [unselectedOptions, setUnselectedOptions] = useState(
    options.filter((option) => !selected.includes(option.value))
  );
  const [suggestedOptions, setSuggestedOptions] = useState(unselectedOptions);

  const handleOnSelect = ({ item: { label } }: { item: { label: string } }) => {
    if (!selected.includes(label)) {
      const newSelected = [...selected, label];
      setSelected(newSelected);
      onSelection(newSelected);
      setSuggestedOptions(
        options.filter((option) => !newSelected.includes(option.label))
      );
      setDefaultOption('');
    }
  };

  const handleOnChange = ({ value }: { value: string }) => {
    setDefaultOption(value);
    if (value) {
      setDefaultOption(value);
      const filteredOptions = unselectedOptions.filter((item) =>
        item.label.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestedOptions(filteredOptions);
    } else {
      setSuggestedOptions(unselectedOptions);
    }
  };

  const handleOnBlur = () => setDefaultOption('');

  const handleClear = () => {
    setSelected([]);
    onSelection([]);
    setUnselectedOptions(options);
    setSuggestedOptions(options);
  };

  const handleOnKeyDown = ({
    event: {
      keyCode,
      target: { selectionEnd },
    },
  }: {
    event: { keyCode: number; target: { selectionEnd: number } };
  }) => {
    // Remove tag on backspace if the cursor is at the beginning of the field
    if (keyCode === 8 /* Backspace */ && selectionEnd === 0) {
      const newSelected = [...selected.slice(0, -1)];
      setSelected(newSelected);
      onSelection(newSelected);
      setUnselectedOptions(
        options.filter((option) => !newSelected.includes(option.label))
      );
      setSuggestedOptions(
        options.filter((option) => !newSelected.includes(option.label))
      );
    }
  };

  const handleRemoveTag = (removedValue: string) => {
    const newSelected = selected.filter(
      (tagValue) => tagValue !== removedValue
    );
    setSelected(newSelected);
    onSelection(newSelected);
    setUnselectedOptions(
      options.filter((option) => !newSelected.includes(option.label))
    );
    setSuggestedOptions(
      options.filter((option) => !newSelected.includes(option.label))
    );
  };

  const renderedTags = selected.map((option) => (
    <Tag
      key={option}
      onRemove={() => handleRemoveTag(option)}
      removeIconAccessibilityLabel={`Remove ${option} tag`}
      text={option}
    />
  ));

  return (
    <ComboBox
      id={`combobox-${comboBoxLabel}`}
      accessibilityClearButtonLabel="Clear"
      label={comboBoxLabel}
      inputValue={defaultOption}
      noResultText="No results for your selection"
      options={suggestedOptions}
      onKeyDown={handleOnKeyDown}
      onChange={handleOnChange}
      onClear={handleClear}
      onBlur={handleOnBlur}
      onSelect={handleOnSelect}
      placeholder={selected.length > 0 ? '' : placeholder}
      tags={renderedTags}
    />
  );
}

export default TagComboBox;
