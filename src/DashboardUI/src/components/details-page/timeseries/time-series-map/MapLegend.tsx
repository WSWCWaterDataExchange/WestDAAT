interface LegendItem {
    name: string;
    color: string;
  }
  
  interface MapLegendProps {
    items: LegendItem[];
  }
  
  const MapLegend: React.FC<MapLegendProps> = ({ items }) => {
    return (
        <div style={{ 
          position: 'absolute', 
          bottom: '55px', 
          right: '10px', 
          backgroundColor: 'white', 
          padding: '10px', 
          borderRadius: '5px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          zIndex: 999 
        }}>
          {items.map(item => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: item.color, marginRight: '5px' }}></span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      );
    }

  export default MapLegend;