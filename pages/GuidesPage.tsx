
import React from 'react';
import { AccordionItem, CreamIcon, PillIcon } from '../App'; // Assuming AccordionItem is exported from App.tsx

const GuidesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-textPrimary">How-To & Safety Guides</h1>
      <p className="text-textSecondary">Important information for managing your medications effectively and safely.</p>
      
      <div className="bg-surface rounded-lg shadow p-2 md:p-4">
        <AccordionItem title="How to Properly Apply Creams & Ointments">
          <div className="space-y-3">
            <p>Proper application ensures the medication works effectively and minimizes potential side effects.</p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li><strong>Wash your hands:</strong> Always wash your hands thoroughly with soap and water before and after applying topical medications.</li>
              <li><strong>Clean the affected area:</strong> Gently clean the affected skin with mild soap and water, then pat dry with a clean towel, unless otherwise directed by your doctor.</li>
              <li><strong>Apply a thin layer:</strong> Squeeze a small amount of cream or ointment onto your fingertip (or a cotton swab/applicator if provided). Apply a thin, even layer to the affected skin only. Do not use more than prescribed.</li>
              <li><strong>Rub in gently:</strong> Rub the medication in gently and completely, unless your doctor has told you otherwise (some medications should just be dabbed on).</li>
              <li><strong>Avoid sensitive areas:</strong> Do not apply to eyes, mouth, nose, or genital areas unless specifically instructed by your doctor for those areas.</li>
              <li><strong>Do not cover (usually):</strong> Do not bandage, cover, or wrap the treated skin unless your doctor tells you to. This can increase absorption and risk of side effects.</li>
              <li><strong>Wait before dressing:</strong> Allow the medication to absorb for a few minutes before covering with clothing.</li>
            </ol>
            <div className="flex items-center p-3 bg-blue-50 rounded-md border border-blue-200">
              <CreamIcon className="w-8 h-8 text-blue-500 mr-3 flex-shrink-0" />
              <p className="text-sm text-blue-700"><strong>Tip:</strong> Use a "fingertip unit" as a guide for amount if unsure. One fingertip unit (from the tip of an adult finger to the first crease) is usually enough to cover an area of skin twice the size of an adult hand.</p>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem title="What to Do If You Miss a Dose">
          <div className="space-y-3">
            <p>Missing a dose can happen. Here's general guidance, but always check your medication's specific instructions or consult your doctor/pharmacist.</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>If it's close to the time you remembered:</strong>
                <ul className="list-circle list-inside ml-4">
                    <li>For most medications, if you remember within an hour or two of the missed dose, take it as soon as you remember.</li>
                    <li>Then, take your next dose at the regularly scheduled time. Do NOT take a double dose to make up for the missed one.</li>
                </ul>
              </li>
              <li><strong>If it's almost time for your next dose:</strong>
                <ul className="list-circle list-inside ml-4">
                    <li>Skip the missed dose entirely.</li>
                    <li>Take your next dose at the regular time. Do NOT take a double dose.</li>
                </ul>
              </li>
              <li><strong>For "As Needed" medications:</strong> This typically doesn't apply as you take them based on symptoms, not a fixed schedule.</li>
              <li><strong>Unsure?</strong> If you're ever unsure what to do, call your doctor or pharmacist for advice.</li>
            </ul>
             <div className="flex items-center p-3 bg-yellow-50 rounded-md border border-yellow-300">
              <PillIcon className="w-8 h-8 text-yellow-500 mr-3 flex-shrink-0" />
              <p className="text-sm text-yellow-700"><strong>Important:</strong> Never double up on doses to "catch up" unless specifically instructed by your healthcare provider, as this can increase the risk of side effects.</p>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem title="Understanding & Reporting Side Effects">
          <div className="space-y-3">
            <p>All medications can have side effects. Most are mild, but some can be serious. It's important to know what to look for and when to seek help.</p>
            <h4 className="font-semibold text-textPrimary">Common, Mild Side Effects:</h4>
            <p className="text-sm">These often go away as your body adjusts. Examples: mild rash, itching (for creams), drowsiness, upset stomach. Check your medication leaflet for specific common side effects.</p>
            
            <h4 className="font-semibold text-textPrimary">Serious Side Effects (Seek Medical Attention):</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Difficulty breathing or swallowing</li>
              <li>Swelling of your face, lips, tongue, or throat (signs of a severe allergic reaction)</li>
              <li>Severe dizziness or fainting</li>
              <li>Unusual bleeding or bruising</li>
              <li>Severe rash, hives, or blistering</li>
              <li>Changes in heartbeat</li>
              <li>Any other symptom that concerns you or feels severe</li>
            </ul>
            <h4 className="font-semibold text-textPrimary">Reporting Side Effects:</h4>
            <p className="text-sm">If you experience any side effects, especially if they are bothersome or don't go away:
                <ol className="list-decimal list-inside ml-4">
                    <li>Contact your doctor or pharmacist. They can advise if it's normal or if your medication needs to be adjusted or changed.</li>
                    <li>You can also report side effects to regulatory agencies (e.g., FDA MedWatch in the US). Your doctor can help with this.</li>
                </ol>
            </p>
          </div>
        </AccordionItem>

        <AccordionItem title="How to Store Your Medicine Safely">
          <div className="space-y-3">
            <p>Proper storage helps maintain your medication's effectiveness and safety.</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Read the label:</strong> Always check the medication label or patient information leaflet for specific storage instructions (e.g., "refrigerate," "store at room temperature," "protect from light").</li>
              <li><strong>Cool, dry place:</strong> Most medications should be stored in a cool, dry place, away from direct sunlight, heat, and moisture. The bathroom medicine cabinet is often NOT ideal due to humidity and temperature changes. A bedroom closet shelf or a kitchen cabinet away from the stove/sink is better.</li>
              <li><strong>Original container:</strong> Keep medications in their original, labeled containers. This helps identify them and provides important information like expiration dates.</li>
              <li><strong>Out of reach and sight of children and pets:</strong> This is crucial to prevent accidental ingestion. Consider a locked box or high cabinet.</li>
              <li><strong>Don't mix medications:</strong> Avoid combining different pills in one bottle.</li>
              <li><strong>Check expiration dates:</strong> Regularly check expiration dates and dispose of expired or unused medications properly. Do not use expired medicine.</li>
              <li><strong>Traveling:</strong> Keep medications in your carry-on luggage. If refrigeration is needed, use an insulated bag with a cool pack.</li>
            </ul>
            <p className="text-sm"><strong>Disposal:</strong> Ask your pharmacist about local take-back programs for unused or expired medications. Do not flush most medications down the toilet unless specifically instructed, as this can harm the environment.</p>
          </div>
        </AccordionItem>
      </div>
    </div>
  );
};

export default GuidesPage;
