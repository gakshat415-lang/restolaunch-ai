import { useState } from 'react';
import type { RestaurantRequest } from '../api';

interface SearchFormProps {
  onSearch: (request: RestaurantRequest) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [formData, setFormData] = useState<RestaurantRequest>({
    location: '',
    format: '',
    budget: 0,
    cuisine: '',
  });

  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.budget < 300 || formData.budget > 10000) {
      setLocalError("not applicable");
      return;
    }
    setLocalError(null);
    onSearch(formData);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md mx-auto transition-all">
      <h2 className="text-2xl font-display font-semibold mb-6 text-slate-900 tracking-tight">Market Criteria</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
          <input
            type="text"
            required
            list="bangalore-locations"
            placeholder="e.g. Indiranagar"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder:text-slate-400"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <datalist id="bangalore-locations">
            <option value="BTM" />
            <option value="Banashankari" />
            <option value="Banaswadi" />
            <option value="Bannerghatta Road" />
            <option value="Basavanagudi" />
            <option value="Basaveshwara Nagar" />
            <option value="Bellandur" />
            <option value="Bommanahalli" />
            <option value="Brigade Road" />
            <option value="Brookefield" />
            <option value="CV Raman Nagar" />
            <option value="Central Bangalore" />
            <option value="Church Street" />
            <option value="City Market" />
            <option value="Commercial Street" />
            <option value="Cunningham Road" />
            <option value="Domlur" />
            <option value="East Bangalore" />
            <option value="Ejipura" />
            <option value="Electronic City" />
            <option value="Frazer Town" />
            <option value="HBR Layout" />
            <option value="HSR" />
            <option value="Hebbal" />
            <option value="Hennur" />
            <option value="Hosur Road" />
            <option value="ITPL Main Road, Whitefield" />
            <option value="Indiranagar" />
            <option value="Infantry Road" />
            <option value="JP Nagar" />
            <option value="Jakkur" />
            <option value="Jalahalli" />
            <option value="Jayanagar" />
            <option value="Jeevan Bhima Nagar" />
            <option value="KR Puram" />
            <option value="Kaggadasapura" />
            <option value="Kalyan Nagar" />
            <option value="Kammanahalli" />
            <option value="Kanakapura Road" />
            <option value="Kengeri" />
            <option value="Koramangala" />
            <option value="Koramangala 1st Block" />
            <option value="Koramangala 2nd Block" />
            <option value="Koramangala 3rd Block" />
            <option value="Koramangala 4th Block" />
            <option value="Koramangala 5th Block" />
            <option value="Koramangala 6th Block" />
            <option value="Koramangala 7th Block" />
            <option value="Koramangala 8th Block" />
            <option value="Kumaraswamy Layout" />
            <option value="Langford Town" />
            <option value="Lavelle Road" />
            <option value="MG Road" />
            <option value="Magadi Road" />
            <option value="Majestic" />
            <option value="Malleshwaram" />
            <option value="Marathahalli" />
            <option value="Mysore Road" />
            <option value="Nagarbhavi" />
            <option value="Nagawara" />
            <option value="New BEL Road" />
            <option value="North Bangalore" />
            <option value="Old Airport Road" />
            <option value="Old Madras Road" />
            <option value="Peenya" />
            <option value="RT Nagar" />
            <option value="Race Course Road" />
            <option value="Rajajinagar" />
            <option value="Rajarajeshwari Nagar" />
            <option value="Rammurthy Nagar" />
            <option value="Residency Road" />
            <option value="Richmond Road" />
            <option value="Sadashiv Nagar" />
            <option value="Sahakara Nagar" />
            <option value="Sanjay Nagar" />
            <option value="Sankey Road" />
            <option value="Sarjapur Road" />
            <option value="Seshadripuram" />
            <option value="Shanti Nagar" />
            <option value="Shivajinagar" />
            <option value="South Bangalore" />
            <option value="St. Marks Road" />
            <option value="Thippasandra" />
            <option value="Ulsoor" />
            <option value="Uttarahalli" />
            <option value="Varthur Main Road, Whitefield" />
            <option value="Vasanth Nagar" />
            <option value="Vijay Nagar" />
            <option value="West Bangalore" />
            <option value="Whitefield" />
            <option value="Wilson Garden" />
            <option value="Yelahanka" />
            <option value="Yeshwantpur" />
          </datalist>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Format</label>
          <div className="relative">
            <select
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors appearance-none"
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value })}
            >
              <option value="" disabled>Select a format</option>
              <option value="Casual Dining">Casual Dining</option>
              <option value="Fine Dining">Fine Dining</option>
              <option value="Quick Bites">Quick Bites</option>
              <option value="Cafe">Cafe</option>
              <option value="Dessert Parlor">Dessert Parlor</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Budget (₹)</label>
          <input
            type="number"
            required
            min="300"
            max="10000"
            step="1"
            placeholder="e.g. 1000"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder:text-slate-400"
            value={formData.budget || ''}
            onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cuisine</label>
          <div className="relative">
            <select
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors appearance-none"
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
            >
              <option value="" disabled>Select a cuisine</option>
              <option value="North Indian">North Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="South Indian">South Indian</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Biryani">Biryani</option>
              <option value="Continental">Continental</option>
              <option value="Desserts">Desserts</option>
              <option value="Cafe">Cafe</option>
              <option value="Beverages">Beverages</option>
              <option value="Italian">Italian</option>
              <option value="Bakery">Bakery</option>
              <option value="Street Food">Street Food</option>
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
              <option value="Seafood">Seafood</option>
              <option value="Ice Cream">Ice Cream</option>
              <option value="Andhra">Andhra</option>
              <option value="Mughlai">Mughlai</option>
              <option value="Rolls">Rolls</option>
              <option value="American">American</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {localError && (
          <div className="text-red-500 text-sm font-medium mt-2">
            {localError}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-slate-800 text-white font-semibold py-3.5 rounded-lg transition-all shadow-lg hover:shadow-xl flex justify-center items-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Market...
            </>
          ) : (
            'Calculate Opportunity'
          )}
        </button>
      </form>
    </div>
  );
}
