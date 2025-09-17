import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Search, 
  Plus, 
  User, 
  Calendar, 
  Heart,
  Activity,
  Target,
  TrendingUp,
  FileText,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const patients = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 34,
    email: "sarah.j@email.com",
    phone: "+1 (555) 123-4567",
    dosha: "Vata-Pitta",
    lastVisit: "2024-01-15",
    status: "Active",
    avatar: "/api/placeholder/32/32",
    goals: "Weight management, digestive health",
    progress: 78
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 42,
    email: "m.chen@email.com",
    phone: "+1 (555) 234-5678",
    dosha: "Pitta",
    lastVisit: "2024-01-12",
    status: "Follow-up",
    avatar: "/api/placeholder/32/32",
    goals: "Energy balance, stress management",
    progress: 85
  },
  {
    id: 3,
    name: "Emma Davis",
    age: 28,
    email: "emma.davis@email.com",
    phone: "+1 (555) 345-6789",
    dosha: "Kapha",
    lastVisit: "2024-01-10",
    status: "Active",
    avatar: "/api/placeholder/32/32",
    goals: "Metabolism boost, immunity",
    progress: 62
  }
];

const selectedPatient = patients[0];

const doshaQualities = {
  "Vata": {
    color: "bg-[#9E7E3D]/10 text-[#9E7E3D] border-[#9E7E3D]/20",
    qualities: ["Light", "Dry", "Cold", "Rough", "Subtle", "Mobile"],
    description: "Governs movement and communication"
  },
  "Pitta": {
    color: "bg-[#F5C24D]/20 text-[#9E7E3D] border-[#F5C24D]/30",
    qualities: ["Hot", "Sharp", "Light", "Oily", "Liquid", "Spreading"],
    description: "Governs digestion and metabolism"
  },
  "Kapha": {
    color: "bg-[#4C7A5A]/20 text-[#9E7E3D] border-[#4C7A5A]/30",
    qualities: ["Heavy", "Slow", "Cold", "Oily", "Smooth", "Dense"],
    description: "Governs structure and immunity"
  }
};

const healthMetrics = [
  { label: "BMI", value: "22.4", target: "18.5-24.9", status: "normal" },
  { label: "Blood Pressure", value: "118/76", target: "<120/80", status: "normal" },
  { label: "Energy Level", value: "7/10", target: "8+", status: "improving" },
  { label: "Digestive Health", value: "Good", target: "Excellent", status: "improving" },
  { label: "Sleep Quality", value: "8/10", target: "8+", status: "normal" },
  { label: "Stress Level", value: "4/10", target: "<3", status: "attention" }
];

export function PatientManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(1);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.dosha.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPatient = patients.find(p => p.id === selectedPatientId) || selectedPatient;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl text-[#9E7E3D] mb-2 font-semibold">Patient Management</h1>
          <p className="text-[#4C7A5A]/80">Manage patient profiles and Ayurvedic assessments.</p>
        </div>
        <Button className="btn-rustic animate-slide-in-right">
          <Plus className="w-4 h-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <Card className="card-rustic animate-slide-in-left">
          <CardHeader>
            <CardTitle className="text-[#9E7E3D] flex items-center">
              <User className="w-5 h-5 mr-2 text-[#F5C24D]" />
              Patients
            </CardTitle>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#9E7E3D]/50" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-[#9E7E3D]/20 focus:border-[#4C7A5A] bg-white transition-all duration-300 focus:shadow-md"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPatients.map((patient, index) => (
                <div
                  key={patient.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 animate-on-scroll ${
                    selectedPatientId === patient.id
                      ? 'bg-gradient-to-r from-[#F5C24D]/20 to-[#4C7A5A]/20 border border-[#9E7E3D]/20 shadow-md'
                      : 'bg-[#E1D1A5]/30 hover:bg-[#F5C24D]/20 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedPatientId(patient.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 ring-2 ring-[#F5C24D]/30">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback className="bg-[#F5C24D] text-[#9E7E3D] font-medium">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate text-[#9E7E3D] font-medium">{patient.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs bg-[#F5C24D]/30 text-[#9E7E3D] border-[#9E7E3D]/20">
                          {patient.dosha}
                        </Badge>
                        <Badge 
                          variant={patient.status === 'Active' ? 'default' : 'secondary'}
                          className="text-xs bg-[#4C7A5A]/30 text-[#9E7E3D] border-[#9E7E3D]/20"
                        >
                          {patient.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-rustic animate-slide-in-right">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16 border-2 border-[#F5C24D]/30">
                    <AvatarImage src={currentPatient.avatar} />
                    <AvatarFallback className="bg-[#F5C24D] text-[#9E7E3D] text-lg font-semibold">
                      {currentPatient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl text-[#9E7E3D] font-semibold">{currentPatient.name}</h3>
                    <p className="text-[#4C7A5A]/80">Age: {currentPatient.age}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-[#4C7A5A]/70">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-[#F5C24D]" />
                        {currentPatient.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-[#F5C24D]" />
                        {currentPatient.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="btn-rustic-outline">
                  <FileText className="w-4 h-4 mr-2" />
                  View History
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="assessment" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-[#E1D1A5]/50 border border-[#9E7E3D]/20">
              <TabsTrigger value="assessment" className="data-[state=active]:bg-white data-[state=active]:text-[#9E7E3D] text-[#4C7A5A]/70 transition-all duration-300">
                Ayurvedic Assessment
              </TabsTrigger>
              <TabsTrigger value="metrics" className="data-[state=active]:bg-white data-[state=active]:text-[#9E7E3D] text-[#4C7A5A]/70 transition-all duration-300">
                Health Metrics
              </TabsTrigger>
              <TabsTrigger value="dosha" className="data-[state=active]:bg-white data-[state=active]:text-[#9E7E3D] text-[#4C7A5A]/70 transition-all duration-300">
                Dosha Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assessment">
              <Card className="card-rustic animate-on-scroll">
                <CardHeader>
                  <CardTitle className="text-[#9E7E3D]">Current Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-[#4C7A5A]/70">Primary Dosha</label>
                      <Badge className={doshaQualities[currentPatient.dosha.split('-')[0]]?.color}>
                        {currentPatient.dosha}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-[#4C7A5A]/70">Treatment Goals</label>
                      <p className="text-sm text-[#9E7E3D]">{currentPatient.goals}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-[#4C7A5A]/70">Progress</label>
                      <div className="space-y-1">
                        <Progress value={currentPatient.progress} className="h-3 bg-[#E1D1A5]/50" />
                        <p className="text-sm text-[#4C7A5A]/70">{currentPatient.progress}% complete</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-[#4C7A5A]/70">Last Visit</label>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-[#F5C24D]" />
                        <span className="text-sm text-[#9E7E3D]">{new Date(currentPatient.lastVisit).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full btn-rustic">
                    <Activity className="w-4 h-4 mr-2" />
                    Schedule New Assessment
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics">
              <Card className="card-rustic animate-on-scroll">
                <CardHeader>
                  <CardTitle className="text-[#9E7E3D]">Health Metrics Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {healthMetrics.map((metric, index) => (
                      <div key={index} className="p-4 border border-[#9E7E3D]/20 rounded-lg bg-gradient-to-br from-[#E1D1A5]/30 to-[#F5C24D]/10 hover:shadow-md transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[#4C7A5A]/70">{metric.label}</span>
                          <Badge 
                            variant={metric.status === 'normal' ? 'default' : 
                                   metric.status === 'improving' ? 'secondary' : 'destructive'}
                            className="text-xs bg-[#F5C24D]/20 text-[#9E7E3D] border-[#9E7E3D]/20"
                          >
                            {metric.status}
                          </Badge>
                        </div>
                        <p className="text-lg text-[#9E7E3D] font-semibold">{metric.value}</p>
                        <p className="text-xs text-[#4C7A5A]/60 mt-1">Target: {metric.target}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dosha">
              <Card className="card-rustic animate-on-scroll">
                <CardHeader>
                  <CardTitle className="text-[#9E7E3D]">Dosha Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(doshaQualities).map(([dosha, info], index) => (
                      <div key={dosha} className="p-4 border border-[#9E7E3D]/20 rounded-lg bg-gradient-to-r from-white to-[#E1D1A5]/30 hover:shadow-md transition-all duration-300" style={{ animationDelay: `${index * 0.2}s` }}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg text-[#9E7E3D] font-semibold">{dosha}</h4>
                          <Badge className={info.color}>{dosha}</Badge>
                        </div>
                        <p className="text-sm text-[#4C7A5A]/80 mb-3">{info.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {info.qualities.map((quality, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-[#9E7E3D]/30 text-[#9E7E3D] hover:bg-[#F5C24D]/20 transition-colors duration-200">
                              {quality}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}