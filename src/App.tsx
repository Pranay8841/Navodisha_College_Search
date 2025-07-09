import React, { useState } from 'react';
import { Search, MapPin, BookOpen, Loader2, AlertCircle, TrendingUp, Award, Users, Filter } from 'lucide-react';
import Logo from './assets/IMG-20240521-WA0022.jpg'

interface College {
  college: string;
  branch: string;
}

interface SearchForm {
  searchMethod: 'rank' | 'percentile';
  rank: string;
  percentile: string;
  category: string;
  cities: string; // comma-separated city list
  courseType: 'engineering' | 'pharmacy';
}

const simplifiedCategories = [
  { value: 'Open', label: 'Open', color: 'bg-blue-500' },
  { value: 'Ladies', label: 'Ladies', color: 'bg-pink-500' },
  { value: 'OBC', label: 'OBC', color: 'bg-orange-500' },
  { value: 'SEBC', label: 'SEBC', color: 'bg-yellow-500' },
  { value: 'SC', label: 'SC', color: 'bg-red-500' },
  { value: 'VJ', label: 'VJ', color: 'bg-green-500' },
  { value: 'NT1', label: 'NT1', color: 'bg-indigo-500' },
  { value: 'NT2', label: 'NT2', color: 'bg-indigo-400' },
  { value: 'NT3', label: 'NT3', color: 'bg-indigo-300' },
  { value: 'TFWS', label: 'TFWS (Fee Waiver)', color: 'bg-purple-500' },
  { value: 'Defence', label: 'Defence', color: 'bg-gray-500' },
  { value: 'PWD', label: 'PWD', color: 'bg-teal-500' },
  { value: 'EWS', label: 'EWS', color: 'bg-lime-500' },
  { value: 'Orphan', label: 'Orphan', color: 'bg-fuchsia-500' },
  { value: 'Minority', label: 'Minority', color: 'bg-cyan-500' },
  { value: 'Others', label: 'Others', color: 'bg-white/30' }
];

const mapToTechnicalCategories = (category: string): string[] => {
  const mapping: { [key: string]: string[] } = {
    Open: ['GOPENS', 'GOPENO', 'GOPENH'],
    Ladies: ['LOPENS', 'LOPENO', 'LOPENH'],
    OBC: ['GOBCS', 'LOBCS', 'DEFOBCS', 'DEFROBCS'],
    SEBC: ['GSEBCS', 'LSEBCS', 'DEFSEBCS'],
    SC: ['GSCS', 'LSCS'],
    VJ: ['GVJS', 'LVJS'],
    NT1: ['GNT1S', 'LNT1S'],
    NT2: ['GNT2S', 'LNT2S'],
    NT3: ['GNT3S', 'LNT3S'],
    TFWS: ['TFWS'],
    Defence: ['DEFOPENS', 'DEFOBCS', 'DEFSEBCS', 'DEFROBCS'],
    PWD: ['PWDOPENS'],
    Orphan: ['ORPHAN'],
    EWS: ['EWS'],
    Minority: ['MI'],
    Others: []
  };
  return mapping[category] || [];
};


function App() {
  const [form, setForm] = useState<SearchForm>({
    searchMethod: 'rank',
    rank: '',
    percentile: '',
    category: '',
    cities: '',
    courseType: 'engineering' // DEFAULT VALUE
  });
  const [results, setResults] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (field: keyof SearchForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!form.category) {
      setError('Please select a category');
      return false;
    }

    if (form.searchMethod === 'rank') {
      if (!form.rank || parseInt(form.rank) <= 0) {
        setError('Please enter a valid rank');
        return false;
      }
    } else {
      if (!form.percentile || parseFloat(form.percentile) < 0 || parseFloat(form.percentile) > 100) {
        setError('Please enter a valid percentile (0-100)');
        return false;
      }
    }

    return true;
  };

  const handleSearch = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const technicalCategories = mapToTechnicalCategories(form.category);
      const params = new URLSearchParams({
        ...(form.searchMethod === 'rank'
          ? { rank: form.rank }
          : { percentile: form.percentile }),
        courseType: form.courseType // ✅ Add courseType to query
      });

      technicalCategories.forEach(cat => params.append('category', cat));

      const citiesArray = form.cities
        .split(',')
        .map(city => city.trim())
        .filter(Boolean);
      citiesArray.forEach(city => params.append('cities', city));

      const response = await fetch(`/api/colleges?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch colleges');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to search colleges. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };


  const selectedCategory = simplifiedCategories.find(cat => cat.value === form.category);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-75"></div>
                <div className="relative p-3 bg-white rounded-xl">
                  <img src={Logo} className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Navodisha College Search
                </h1>
                <p className="text-purple-200 font-medium">Discover Your Future</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-white/80">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">Smart Matching</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span className="text-sm">Top Colleges</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-8">
          {/* Search Panel */}
          <div className="w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 sticky top-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Filter className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Find Your Match</h2>
              </div>

              {/* Course Type Toggle */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-purple-200 mb-4">
                  Course Type
                </label>
                <div className="bg-white/5 rounded-xl p-1 grid grid-cols-2 gap-1">
                  <button
                    onClick={() => handleInputChange('courseType', 'engineering')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${form.courseType === 'engineering'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    Engineering
                  </button>
                  <button
                    onClick={() => handleInputChange('courseType', 'pharmacy')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${form.courseType === 'pharmacy'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    Pharmacy
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="w-full md:w-1/2">
                  {/* Search Method Toggle */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-purple-200 mb-4">
                      Search Method
                    </label>
                    <select
                      value={form.searchMethod}
                      onChange={(e) => handleInputChange('searchMethod', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none"
                    >
                      <option value="rank" className="bg-slate-800">Merit Rank</option>
                      <option value="percentile" className="bg-slate-800">Percentile</option>
                    </select>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  {/* Input Field */}
                  <div className="mb-8">
                    {form.searchMethod === 'rank' ? (
                      <div>
                        <label className="block text-sm font-semibold text-purple-200 mb-3">
                          Your Merit Rank
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="Enter your rank"
                            value={form.rank}
                            onChange={(e) => handleInputChange('rank', e.target.value)}
                            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                            min="1"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <TrendingUp className="h-5 w-5 text-purple-400" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-semibold text-purple-200 mb-3">
                          Your Percentile
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="Enter percentile (0-100)"
                            value={form.percentile}
                            onChange={(e) => handleInputChange('percentile', e.target.value)}
                            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <span className="text-purple-400 font-medium">%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="w-full md:w-1/2">
                  {/* Category Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-purple-200 mb-3">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={form.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none"
                      >
                        <option value="" className="bg-slate-800">Select Category</option>
                        {simplifiedCategories.map(category => (
                          <option key={category.value} value={category.value} className="bg-slate-800">
                            {category.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <Users className="h-5 w-5 text-purple-400" />
                      </div>
                    </div>
                    {selectedCategory && (
                      <div className="mt-3 flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${selectedCategory.color}`}></div>
                        <span className="text-sm text-purple-200">{selectedCategory.label}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  {/* City Input */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-purple-200 mb-3">
                      City (comma separated)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Pune, Mumbai"
                        value={form.cities}
                        onChange={(e) => handleInputChange('cities', e.target.value)}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <MapPin className="h-5 w-5 text-purple-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center space-x-3 backdrop-blur-sm">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <span className="text-sm text-red-200">{error}</span>
                </div>
              )}

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-fit px-6 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Find My Colleges</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {hasSearched ? 'Your College Matches' : 'Ready to Explore?'}
                </h2>
                {hasSearched && (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {results.length} matches found
                  </div>
                )}
              </div>

              {!hasSearched ? (
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-50"></div>
                    <div className="relative p-6 bg-white/10 rounded-full w-24 h-24 mx-auto flex items-center justify-center backdrop-blur-sm">
                      <BookOpen className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Your Engineering Journey Starts Here
                  </h3>
                  <p className="text-purple-200 max-w-md mx-auto text-lg leading-relaxed">
                    Enter your exam details to discover the perfect engineering colleges tailored to your achievements.
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur opacity-50"></div>
                    <div className="relative p-6 bg-white/10 rounded-full w-24 h-24 mx-auto flex items-center justify-center backdrop-blur-sm">
                      <AlertCircle className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    No Matches Found
                  </h3>
                  <p className="text-purple-200 max-w-md mx-auto text-lg leading-relaxed">
                    Try adjusting your search criteria or explore different categories to find more options.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((college, index) => (
                    <div
                      key={index}
                      className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm transform hover:scale-[1.02]"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                          <div className="relative p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                            <MapPin className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-200 transition-colors">
                            {college.college}
                          </h3>
                          <div className="flex items-center space-x-2 text-purple-200">
                            <BookOpen className="h-4 w-4" />
                            <span className="font-medium">{college.branch}</span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                            <Award className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;