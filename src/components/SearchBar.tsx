import { useState, useEffect } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { Combobox, TextInput, Loader, useCombobox } from '@mantine/core';
import { Coin } from '../types/globals';
import { getAll } from '../services/coinGeckoApi';
import CoinPreview from './CoinPreview';

type Props = {

  onSelect: (symbol: Coin) => void;

};

function SearchBar({ onSelect }: Props) {
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Coin[]>([]);
  const [debouncedValue] = useDebouncedValue(value, 800);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  useEffect(() => {
    const fetchCryptos = async () => {
      if (debouncedValue) {
        setLoading(true);
        try {
          const { coins } = await getAll(debouncedValue);
          setData(coins);
          combobox.openDropdown();
        } catch (error) {
          console.error("Error fetching cryptos:", error);
          setData([]);
        } finally {
          setLoading(false);
        }
      } else {
        setData([]);
        combobox.closeDropdown();
      }
    };

    fetchCryptos();
  }, [debouncedValue]);

  const options = data.map((item) => (
    <Combobox.Option value={item.name} key={item.name}>
      <CoinPreview data={item} />
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        const selectedCoin = data.find((coin) => coin.name === val);
        if (!selectedCoin) return;
        onSelect(selectedCoin);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <TextInput
          placeholder="Search for a crypto..."
          rightSection={loading ? <Loader size={18} /> : null}
          onChange={(e) => setValue(e.currentTarget.value)}
          value={value}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options mah={200} style={{overflowY: 'auto'}}>
          {loading ? (
            <Combobox.Empty>Loading...</Combobox.Empty>
          ) : data.length === 0 && debouncedValue ? (
            <Combobox.Empty>No results found</Combobox.Empty>
          ) : (
            options
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default SearchBar;