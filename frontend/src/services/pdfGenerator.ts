import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Patient {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  primary_dosha: string;
  weight?: number;
  height?: number;
  health_concerns?: string[];
  allergies?: string[];
  dietary_restrictions?: string[];
  email?: string;
  phone?: string;
}

interface DietPlan {
  id: string;
  plan_name: string;
  duration_days: number;
  meal_plan: any;
  ayurvedic_guidelines: string[];
  lifestyle_recommendations: string[];
  nutritional_analysis: any;
  created_at: string;
}

export class PDFReportGenerator {
  static async generateDietPlanPDF(patient: Patient, dietPlan: DietPlan): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, contentWidth);
      checkPageBreak(lines.length * fontSize * 0.35);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * fontSize * 0.35 + 5;
    };

    // Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(158, 126, 61); // #9E7E3D
    pdf.text('AyurSync', margin, yPosition);
    
    pdf.setFontSize(16);
    pdf.text('Personalized Ayurvedic Diet Plan', margin, yPosition + 10);
    
    // Add horizontal line
    pdf.setDrawColor(245, 194, 77); // #F5C24D
    pdf.setLineWidth(1);
    pdf.line(margin, yPosition + 15, pageWidth - margin, yPosition + 15);
    
    yPosition += 25;

    // Patient Information
    pdf.setTextColor(0, 0, 0);
    addText('PATIENT INFORMATION', 14, true);
    
    const patientInfo = [
      `Name: ${patient.full_name}`,
      `Age: ${patient.age} years`,
      `Gender: ${patient.gender}`,
      `Primary Dosha: ${patient.primary_dosha}`,
      `Email: ${patient.email || 'Not provided'}`,
      `Phone: ${patient.phone || 'Not provided'}`
    ];

    if (patient.weight) patientInfo.push(`Weight: ${patient.weight} kg`);
    if (patient.height) patientInfo.push(`Height: ${patient.height} cm`);
    if (patient.weight && patient.height) {
      const bmi = (patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1);
      patientInfo.push(`BMI: ${bmi}`);
    }

    patientInfo.forEach(info => addText(info));

    // Health Concerns
    if (patient.health_concerns && patient.health_concerns.length > 0) {
      addText('Health Concerns:', 12, true);
      addText(`• ${patient.health_concerns.join('\n• ')}`);
    }

    // Allergies
    if (patient.allergies && patient.allergies.length > 0) {
      addText('Allergies:', 12, true);
      addText(`• ${patient.allergies.join('\n• ')}`);
    }

    // Dietary Restrictions
    if (patient.dietary_restrictions && patient.dietary_restrictions.length > 0) {
      addText('Dietary Restrictions:', 12, true);
      addText(`• ${patient.dietary_restrictions.join('\n• ')}`);
    }

    yPosition += 10;

    // Diet Plan Information
    addText('DIET PLAN DETAILS', 14, true);
    addText(`Plan Name: ${dietPlan.plan_name}`);
    addText(`Duration: ${dietPlan.duration_days} days`);
    addText(`Generated on: ${new Date(dietPlan.created_at).toLocaleDateString()}`);

    yPosition += 10;

    // Meal Plan
    if (dietPlan.meal_plan) {
      addText('DAILY MEAL PLAN', 14, true);
      
      Object.entries(dietPlan.meal_plan).forEach(([day, meals]: [string, any]) => {
        checkPageBreak(60);
        
        addText(`Day ${parseInt(day) + 1}`, 12, true);
        
        if (meals.breakfast) {
          addText(`Breakfast: ${meals.breakfast.recipe_name} (${meals.breakfast.calories} calories)`);
          if (meals.breakfast.time) addText(`  Time: ${meals.breakfast.time}`);
        }
        
        if (meals.lunch) {
          addText(`Lunch: ${meals.lunch.recipe_name} (${meals.lunch.calories} calories)`);
          if (meals.lunch.time) addText(`  Time: ${meals.lunch.time}`);
        }
        
        if (meals.dinner) {
          addText(`Dinner: ${meals.dinner.recipe_name} (${meals.dinner.calories} calories)`);
          if (meals.dinner.time) addText(`  Time: ${meals.dinner.time}`);
        }
        
        if (meals.snacks && meals.snacks.length > 0) {
          meals.snacks.forEach((snack: any, index: number) => {
            addText(`Snack ${index + 1}: ${snack.recipe_name} (${snack.calories} calories)`);
            if (snack.time) addText(`  Time: ${snack.time}`);
          });
        }
        
        yPosition += 5;
      });
    }

    // Ayurvedic Guidelines
    if (dietPlan.ayurvedic_guidelines && dietPlan.ayurvedic_guidelines.length > 0) {
      checkPageBreak(80);
      addText('AYURVEDIC GUIDELINES', 14, true);
      dietPlan.ayurvedic_guidelines.forEach(guideline => {
        addText(`• ${guideline}`);
      });
      yPosition += 10;
    }

    // Lifestyle Recommendations
    if (dietPlan.lifestyle_recommendations && dietPlan.lifestyle_recommendations.length > 0) {
      checkPageBreak(80);
      addText('LIFESTYLE RECOMMENDATIONS', 14, true);
      dietPlan.lifestyle_recommendations.forEach(recommendation => {
        addText(`• ${recommendation}`);
      });
      yPosition += 10;
    }

    // Nutritional Analysis
    if (dietPlan.nutritional_analysis) {
      checkPageBreak(100);
      addText('NUTRITIONAL ANALYSIS', 14, true);
      Object.entries(dietPlan.nutritional_analysis).forEach(([key, value]) => {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        addText(`${formattedKey}: ${value}`);
      });
    }

    // Footer
    checkPageBreak(30);
    yPosition = pageHeight - 30;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Generated by AyurSync - Ayurvedic Diet Management System', margin, yPosition);
    pdf.text(`Report generated on: ${new Date().toLocaleDateString()}`, margin, yPosition + 5);
    
    // Add page numbers
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
    }

    // Save the PDF
    const fileName = `${patient.full_name.replace(/\s+/g, '_')}_Diet_Plan_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }

  static async generatePatientSummaryPDF(patient: Patient): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add text
    const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, contentWidth);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * fontSize * 0.35 + 5;
    };

    // Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(158, 126, 61);
    pdf.text('AyurSync', margin, yPosition);
    
    pdf.setFontSize(16);
    pdf.text('Patient Summary Report', margin, yPosition + 10);
    
    // Add horizontal line
    pdf.setDrawColor(245, 194, 77);
    pdf.setLineWidth(1);
    pdf.line(margin, yPosition + 15, pageWidth - margin, yPosition + 15);
    
    yPosition += 25;

    // Patient Details
    pdf.setTextColor(0, 0, 0);
    addText('PATIENT DETAILS', 14, true);
    
    const details = [
      `Full Name: ${patient.full_name}`,
      `Age: ${patient.age} years`,
      `Gender: ${patient.gender}`,
      `Primary Dosha: ${patient.primary_dosha}`,
      `Contact Email: ${patient.email || 'Not provided'}`,
      `Phone Number: ${patient.phone || 'Not provided'}`
    ];

    if (patient.weight) details.push(`Weight: ${patient.weight} kg`);
    if (patient.height) details.push(`Height: ${patient.height} cm`);

    details.forEach(detail => addText(detail));

    // Dosha Information
    yPosition += 10;
    addText('DOSHA CONSTITUTION', 14, true);
    addText(`Primary Dosha: ${patient.primary_dosha}`);
    
    const doshaDescriptions = {
      'Vata': 'Vata governs movement and is associated with air and space elements. People with Vata constitution tend to be creative, energetic, and quick-thinking, but may experience anxiety and digestive irregularities when imbalanced.',
      'Pitta': 'Pitta governs transformation and is associated with fire and water elements. Pitta individuals are typically organized, focused, and goal-oriented, but may experience anger and inflammatory conditions when imbalanced.',
      'Kapha': 'Kapha governs structure and is associated with earth and water elements. Kapha people are usually calm, stable, and nurturing, but may experience weight gain and sluggishness when imbalanced.'
    };

    const primaryDosha = patient.primary_dosha.split('-')[0] as keyof typeof doshaDescriptions;
    if (doshaDescriptions[primaryDosha]) {
      addText(doshaDescriptions[primaryDosha]);
    }

    // Health Summary
    if (patient.health_concerns && patient.health_concerns.length > 0) {
      yPosition += 10;
      addText('HEALTH CONCERNS', 14, true);
      patient.health_concerns.forEach(concern => addText(`• ${concern}`));
    }

    if (patient.allergies && patient.allergies.length > 0) {
      yPosition += 10;
      addText('ALLERGIES & SENSITIVITIES', 14, true);
      patient.allergies.forEach(allergy => addText(`• ${allergy}`));
    }

    if (patient.dietary_restrictions && patient.dietary_restrictions.length > 0) {
      yPosition += 10;
      addText('DIETARY RESTRICTIONS', 14, true);
      patient.dietary_restrictions.forEach(restriction => addText(`• ${restriction}`));
    }

    // Footer
    yPosition = 270;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Generated by AyurSync - Ayurvedic Diet Management System', margin, yPosition);
    pdf.text(`Report generated on: ${new Date().toLocaleDateString()}`, margin, yPosition + 5);

    // Save
    const fileName = `${patient.full_name.replace(/\s+/g, '_')}_Summary_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }

  static async generateRecipePDF(recipe: any): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function
    const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, contentWidth);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * fontSize * 0.35 + 5;
    };

    // Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(158, 126, 61);
    pdf.text('AyurSync Recipe', margin, yPosition);
    yPosition += 15;

    // Recipe name
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    addText(recipe.name, 18, true);

    // Recipe details
    if (recipe.description) addText(recipe.description);
    
    const details = [
      `Meal Type: ${Array.isArray(recipe.meal_type) ? recipe.meal_type.join(', ') : recipe.meal_type}`,
      `Cuisine: ${Array.isArray(recipe.cuisine_type) ? recipe.cuisine_type.join(', ') : recipe.cuisine_type}`,
      `Prep Time: ${recipe.preparation_time} minutes`,
      `Cook Time: ${recipe.cooking_time} minutes`,
      `Servings: ${recipe.servings}`,
      `Difficulty: ${recipe.difficulty_level}`
    ];

    details.forEach(detail => addText(detail));

    // Ingredients
    yPosition += 10;
    addText('INGREDIENTS', 14, true);
    if (recipe.ingredients) {
      recipe.ingredients.forEach((ingredient: any) => {
        addText(`• ${ingredient.quantity} ${ingredient.item}${ingredient.notes ? ` (${ingredient.notes})` : ''}`);
      });
    }

    // Instructions
    yPosition += 10;
    addText('INSTRUCTIONS', 14, true);
    if (recipe.instructions) {
      recipe.instructions.forEach((instruction: any) => {
        addText(`${instruction.step}. ${instruction.instruction}`);
      });
    }

    // Ayurvedic Properties
    if (recipe.ayurvedic_properties) {
      yPosition += 10;
      addText('AYURVEDIC PROPERTIES', 14, true);
      const props = recipe.ayurvedic_properties;
      
      if (props.rasa) addText(`Rasa (Taste): ${Array.isArray(props.rasa) ? props.rasa.join(', ') : props.rasa}`);
      if (props.virya) addText(`Virya (Energy): ${props.virya}`);
      if (props.vipaka) addText(`Vipaka (Post-digestive effect): ${props.vipaka}`);
      if (props.guna) addText(`Guna (Qualities): ${Array.isArray(props.guna) ? props.guna.join(', ') : props.guna}`);
      
      if (props.dosha_effects) {
        addText('Dosha Effects:');
        addText(`  Vata: ${props.dosha_effects.vata}`);
        addText(`  Pitta: ${props.dosha_effects.pitta}`);
        addText(`  Kapha: ${props.dosha_effects.kapha}`);
      }
    }

    // Nutritional Information
    if (recipe.nutrition) {
      yPosition += 10;
      addText('NUTRITIONAL INFORMATION (per serving)', 14, true);
      const nutrition = recipe.nutrition;
      
      addText(`Calories: ${nutrition.calories}`);
      addText(`Protein: ${nutrition.protein_g}g`);
      addText(`Carbohydrates: ${nutrition.carbohydrates_g}g`);
      addText(`Fat: ${nutrition.fat_g}g`);
      addText(`Fiber: ${nutrition.fiber_g}g`);
      if (nutrition.glycemic_index) addText(`Glycemic Index: ${nutrition.glycemic_index}`);
    }

    // Health Benefits
    if (recipe.health_benefits && recipe.health_benefits.length > 0) {
      yPosition += 10;
      addText('HEALTH BENEFITS', 14, true);
      recipe.health_benefits.forEach((benefit: string) => addText(`• ${benefit}`));
    }

    // Footer
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Generated by AyurSync - Ayurvedic Diet Management System', margin, 280);

    // Save
    const fileName = `${recipe.name.replace(/\s+/g, '_')}_Recipe.pdf`;
    pdf.save(fileName);
  }
}