import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeSeriesStateSelect from './TimeSeriesStateSelect';
import { TimeSeriesContext, TimeSeriesContextValue } from '../../TimeSeriesProvider';

const mockSetStates = jest.fn();

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const [selectedStates, setSelectedStatesReal] = React.useState<string[] | undefined>(undefined);
  const setStates = (newStates: string[] | undefined) => {
    mockSetStates(newStates);
    setSelectedStatesReal(newStates);
  };
  const contextValue: TimeSeriesContextValue = {
    states: ['CA', 'NY', 'TX'],
    selectedStates,
    setStates,
    timeSeries: [],
    isTimeSeriesFilterActive: false,
    siteTypes: [],
    selectedSiteTypes: [],
    primaryUseCategories: [],
    selectedPrimaryUseCategories: [],
    variableTypes: [],
    selectedVariableTypes: [],
    waterSourceTypes: [],
    selectedWaterSourceTypes: [],
    minDate: undefined,
    maxDate: undefined,
    setMinDate: jest.fn(),
    setMaxDate: jest.fn(),
    toggleTimeSeries: jest.fn(),
    setTimeSeriesFilterActive: jest.fn(),
    setSiteTypes: jest.fn(),
    setPrimaryUseCategories: jest.fn(),
    setVariableTypes: jest.fn(),
    setWaterSourceTypes: jest.fn(),
    resetTimeSeriesOptions: jest.fn(),
  };
  return <TimeSeriesContext.Provider value={contextValue}>{children}</TimeSeriesContext.Provider>;
};

const renderWithContext = (ui: React.ReactElement) => render(ui, { wrapper: TestWrapper });

beforeEach(() => {
  mockSetStates.mockClear();
});

describe('TimeSeriesStateSelect', () => {
  test('renders and allows selecting a state', async () => {
    renderWithContext(<TimeSeriesStateSelect />);
    expect(screen.getByLabelText('State')).toBeInTheDocument();
    const selectControl = screen.getByRole('combobox');
    await userEvent.click(selectControl);
    const optionNY = await screen.findByRole('option', { name: 'NY' });
    await userEvent.click(optionNY);
    await waitFor(() => {
      expect(mockSetStates).toHaveBeenCalledWith(['NY']);
    });
  });

  test('allows removing a selected state', async () => {
    renderWithContext(<TimeSeriesStateSelect />);
    const selectControl = screen.getByRole('combobox');
    await userEvent.click(selectControl);
    const optionTX = await screen.findByRole('option', { name: 'TX' });
    await userEvent.click(optionTX);
    await waitFor(() => {
      expect(mockSetStates).toHaveBeenCalledWith(['TX']);
    });
    const removeButton = await screen.findByLabelText('Remove TX');
    await userEvent.click(removeButton);
    await waitFor(() => {
      expect(mockSetStates).toHaveBeenCalledWith(undefined);
    });
  });
});

const samplePoints = [
  { id: '1', state: 'CA' },
  { id: '2', state: 'NY' },
  { id: '3', state: 'TX' },
  { id: '4', state: 'NY' },
];

const DummyMapComponent = ({ points }: { points: { id: string; state: string }[] }) => {
  const { selectedStates } = React.useContext(TimeSeriesContext);
  const filteredPoints = selectedStates ? points.filter((point) => selectedStates.includes(point.state)) : points;
  return (
    <div>
      {filteredPoints.map((point) => (
        <div key={point.id} data-testid={`marker-${point.id}`}>
          {point.state}
        </div>
      ))}
    </div>
  );
};

describe('Map Filtering Integration', () => {
  test('filters map markers based on state selection', async () => {
    render(
      <TestWrapper>
        <TimeSeriesStateSelect />
        <DummyMapComponent points={samplePoints} />
      </TestWrapper>,
    );
    expect(screen.getByTestId('marker-1')).toBeInTheDocument();
    expect(screen.getByTestId('marker-2')).toBeInTheDocument();
    expect(screen.getByTestId('marker-3')).toBeInTheDocument();
    expect(screen.getByTestId('marker-4')).toBeInTheDocument();

    const selectControl = screen.getByRole('combobox');
    await userEvent.click(selectControl);
    const optionNY = await screen.findByRole('option', { name: 'NY' });
    await userEvent.click(optionNY);

    await waitFor(() => {
      expect(screen.queryByTestId('marker-1')).toBeNull();
      expect(screen.getByTestId('marker-2')).toBeInTheDocument();
      expect(screen.queryByTestId('marker-3')).toBeNull();
      expect(screen.getByTestId('marker-4')).toBeInTheDocument();
    });
  });
});
