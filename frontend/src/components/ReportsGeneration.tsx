import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { 
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  Printer,
  Share,
  Settings,
  Clock,
  CheckCircle,
  BarChart,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface Patient {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  primaryDosha?: string;
  dosha?: string;
}

const reportTemplates = [
  {
    id: 'comprehensive',
    name: 'Comprehensive Diet Chart',
    description: 'Complete 7-day meal plan with recipes and instructions',
    pages: '8-12 pages',
    includes: ['Meal plan', 'Recipes', 'Shopping list', 'Ayurvedic guidelines']
  },
  {
    id: 'summary',
    name: 'Diet Summary Report',
    description: 'Condensed overview of recommendations and key points',
    pages: '2-3 pages',
    includes: ['Key recommendations', 'Dosha analysis', 'Quick meal ideas']
  },
  {
    id: 'weekly',
    name: 'Weekly Progress Report',
    description: 'Patient progress tracking and assessment updates',
    pages: '4-5 pages',
    includes: ['Progress metrics', 'Assessment updates', 'Recommendations']
  }
];

const samplePatients: Patient[] = [
  { id: 'sarah', name: 'Sarah Johnson', dosha: 'Vata-Pitta' },
  { id: 'michael', name: 'Michael Chen', dosha: 'Pitta' },
  { id: 'emma', name: 'Emma Davis', dosha: 'Kapha' }
];

const recentReports = [
  {
    id: 1,
    patient: 'Sarah Johnson',
    type: 'Comprehensive Diet Chart',
    created: '2024-01-15',
    status: 'Generated',
    pages: 10
  },
  {
    id: 2,
    patient: 'Michael Chen',
    type: 'Weekly Progress Report',
    created: '2024-01-14',
    status: 'Downloaded',
    pages: 4
  },
  {
    id: 3,
    patient: 'Emma Davis',
    type: 'Diet Summary Report',
    created: '2024-01-12',
    status: 'Shared',
    pages: 3
  }
];

export function ReportsGeneration() {
  const [selectedTemplate, setSelectedTemplate] = useState('comprehensive');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [includeRecipes, setIncludeRecipes] = useState(true);
  const [includeShoppingList, setIncludeShoppingList] = useState(true);
  const [includeGuidelines, setIncludeGuidelines] = useState(true);
  const [customNotes, setCustomNotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load patients from backend
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      // Mock API call - you can replace this with actual API service
      // const response = await apiService.getPatients();
      // setPatients(response.data.patients || []);
      
      // For now, use sample data
      setTimeout(() => {
        setPatients(samplePatients);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load patients:', error);
      setError('Failed to load patients. Using sample data.');
      setPatients(samplePatients);
      setLoading(false);
    }
  };

  const currentTemplate = reportTemplates.find(t => t.id === selectedTemplate);

  const handleCheckboxChange = (value: boolean) => {
    return value;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl text-[#9E7E3D] mb-2 font-semibold">Reports & PDF Generation</h1>
          <p className="text-[#4C7A5A]/80">Create and manage patient diet charts and progress reports.</p>
        </div>
        <div className="flex gap-3 animate-slide-in-right">
          <Button className="btn-rustic-outline">
            <Settings className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button className="btn-rustic">
            <FileText className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-rustic animate-slide-in-left">
            <CardHeader>
              <CardTitle className="text-[#9E7E3D]">Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-[#4C7A5A]/70">Patient</label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger className="border-[#9E7E3D]/20 hover:border-[#F5C24D] transition-colors duration-200">
                      <SelectValue placeholder={loading ? "Loading patients..." : "Select patient..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                          </div>
                        </SelectItem>
                      ) : (
                        patients.map(patient => {
                          const patientId = patient._id || patient.id || '';
                          const patientName = patient.fullName || patient.name || '';
                          const patientDosha = patient.primaryDosha || patient.dosha || '';
                          return (
                            <SelectItem key={patientId} value={patientId}>
                              {patientName} ({patientDosha})
                            </SelectItem>
                          );
                        })
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#4C7A5A]/70">Report Template</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="border-[#9E7E3D]/20 hover:border-[#F5C24D] transition-colors duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#4C7A5A]/70">Report Title</label>
                <Input
                  placeholder="Enter custom title (optional)"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="border-[#9E7E3D]/20 focus:border-[#F5C24D] transition-colors duration-200"
                />
              </div>

              {currentTemplate && (
                <div className="p-4 bg-gradient-to-r from-[#E1D1A5]/50 to-[#F5C24D]/20 rounded-lg border border-[#9E7E3D]/20">
                  <h4 className="text-[#9E7E3D] mb-2 font-medium">{currentTemplate.name}</h4>
                  <p className="text-sm text-[#4C7A5A]/80 mb-2">{currentTemplate.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#4C7A5A]/70">{currentTemplate.pages}</span>
                    <div className="flex flex-wrap gap-1">
                      {currentTemplate.includes.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-[#F5C24D]/20 text-[#9E7E3D] border-[#9E7E3D]/20">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-sm text-[#4C7A5A]/70">Include in Report</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recipes"
                      checked={includeRecipes}
                      onCheckedChange={(checked) => setIncludeRecipes(handleCheckboxChange(checked as boolean))}
                      className="border-[#9E7E3D]/30 data-[state=checked]:bg-[#9E7E3D] data-[state=checked]:border-[#9E7E3D]"
                    />
                    <label htmlFor="recipes" className="text-sm text-[#9E7E3D] cursor-pointer">Recipe details with ingredients</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shopping"
                      checked={includeShoppingList}
                      onCheckedChange={(checked) => setIncludeShoppingList(handleCheckboxChange(checked as boolean))}
                      className="border-[#9E7E3D]/30 data-[state=checked]:bg-[#9E7E3D] data-[state=checked]:border-[#9E7E3D]"
                    />
                    <label htmlFor="shopping" className="text-sm text-[#9E7E3D] cursor-pointer">Weekly shopping list</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="guidelines"
                      checked={includeGuidelines}
                      onCheckedChange={(checked) => setIncludeGuidelines(handleCheckboxChange(checked as boolean))}
                      className="border-[#9E7E3D]/30 data-[state=checked]:bg-[#9E7E3D] data-[state=checked]:border-[#9E7E3D]"
                    />
                    <label htmlFor="guidelines" className="text-sm text-[#9E7E3D] cursor-pointer">Ayurvedic guidelines and tips</label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#4C7A5A]/70">Custom Notes</label>
                <Textarea
                  placeholder="Add any specific notes or requirements for this report..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="border-[#9E7E3D]/20 focus:border-[#F5C24D] min-h-[100px] transition-colors duration-200"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  className="btn-rustic-outline flex-1"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button className="btn-rustic flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <div className="space-y-6">
          <Card className="card-rustic animate-slide-in-right">
            <CardHeader>
              <CardTitle className="text-[#9E7E3D] flex items-center">
                <Clock className="w-5 h-5 mr-2 text-[#F5C24D]" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 border border-[#9E7E3D]/20 rounded-lg bg-gradient-to-br from-[#E1D1A5]/20 to-white hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm text-[#9E7E3D] font-medium">{report.patient}</h4>
                      <Badge
                        variant={report.status === 'Generated' ? 'default' : 'secondary'}
                        className="text-xs bg-[#F5C24D]/20 text-[#9E7E3D] border-[#9E7E3D]/20"
                      >
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#4C7A5A]/70 mb-2">{report.type}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#4C7A5A]/60">{report.created}</span>
                      <span className="text-xs text-[#4C7A5A]/60">{report.pages} pages</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-rustic animate-slide-in-right">
            <CardHeader>
              <CardTitle className="text-[#9E7E3D] flex items-center">
                <BarChart className="w-5 h-5 mr-2 text-[#F5C24D]" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#4C7A5A]/70">Total Reports</span>
                  <span className="text-lg text-[#9E7E3D] font-semibold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#4C7A5A]/70">This Month</span>
                  <span className="text-lg text-[#9E7E3D] font-semibold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#4C7A5A]/70">Most Popular</span>
                  <span className="text-sm text-[#9E7E3D] font-medium">Comprehensive</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}