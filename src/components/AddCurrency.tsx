import { Button, NumberInput, Flex, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { type Alert, type AlertType, type Coin, AlertItem } from '../types/globals';

type Props = {

  dataItem: Coin | AlertItem;
  onSubmit: (data: Alert) => void;

}

interface AlertFormValues {

  price: number;
  alert_type: AlertType;

}

const alertTypes = [

  { value: 'PRICE_ABOVE', label: 'Precio por encima' },
  { value: 'PRICE_BELOW', label: 'Precio por debajo' },
  { value: 'PRICE_EXACT', label: 'Precio justo' }

]

function addCurrency({ dataItem, onSubmit }: Props) {

  const form = useForm<AlertFormValues>({

    mode: 'uncontrolled',
    initialValues: {

      price: dataItem.price || 0,
      alert_type: ('symbol_id' in dataItem) ? dataItem.alert_type : 'PRICE_ABOVE'

    },

    validate: {

      price: (value: number) => Number.isFinite(value) ? null : 'Ingresa un número válido',
      alert_type: (value: string) => ['PRICE_ABOVE', 'PRICE_BELOW', 'PRICE_EXACT'].includes(value) ? null : 'Selecciona un tipo de alerta'

    }

  })

  return (

    <form onSubmit={form.onSubmit(async (data) => {

      if ('alert_id' in dataItem) {
        onSubmit({

          ...data,
          alert_id: dataItem.alert_id,
          symbol: dataItem.symbol

        });
        return;
      }

      else if ('id' in dataItem) {
        const alertData: Alert = {
          ...data,
          symbol_id: dataItem.id,
          symbol: dataItem.symbol
        }
        onSubmit(alertData);
      }

    })}>

      <Flex direction="column" gap={32}>
        <Select

          label='Tipo de alerta'
          placeholder='Selecciona el tipo de alerta'
          data={alertTypes}
          key={form.key('alert_type')}
          {...form.getInputProps('alert_type')}

        />

        <NumberInput

          label='Precio de alerta'
          placeholder='Ingresa el precio'
          key={form.key('price')}
          {...form.getInputProps('price')}

        />

        <Button type='submit'>Establecer alerta</Button>

      </Flex>

    </form>

  );
}

export default addCurrency;