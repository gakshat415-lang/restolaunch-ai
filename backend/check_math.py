import sys
sys.path.append('.')
from services.data_service import get_data, load_data
from services.engine import calculate_opportunity, filter_competitors
from models.schemas import RestaurantRequest

load_data()
df = get_data()
req = RestaurantRequest(location='Banashankari', format='cafe', budget=700, cuisine='Italian')
filtered = filter_competitors(req)
res = calculate_opportunity(req, filtered)
print(res)
