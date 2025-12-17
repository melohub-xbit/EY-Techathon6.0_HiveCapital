from app.models.session import LoanApplicationState
from app.core.state_manager import StateManager
from datetime import datetime
import os

class SanctionAgent:
    def process(self, state: LoanApplicationState, user_message: str) -> str:
        manager = StateManager()
        
        if not state.is_approved:
            return "Cannot generate sanction letter for unapproved loan."

        # Generate PDF Sanction Letter using ReportLab
        from reportlab.lib.pagesizes import letter
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        
        static_dir = "static"
        os.makedirs(static_dir, exist_ok=True)
        
        filename = f"Sanction_Letter_{state.session_id}.pdf"
        filepath = os.path.join(static_dir, filename)
        
        doc = SimpleDocTemplate(filepath, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # 1. Title
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            alignment=1, # Center
            fontSize=20,
            textColor=colors.HexColor('#10B981'), # Emerald Green
            spaceAfter=20
        )
        story.append(Paragraph("HIVE CAPITAL - SANCTION LETTER", title_style))
        story.append(Spacer(1, 12))
        
        # 2. Date and Ref
        normal_style = styles['Normal']
        story.append(Paragraph(f"<b>Date:</b> {datetime.now().strftime('%Y-%m-%d')}", normal_style))
        story.append(Paragraph(f"<b>Reference No:</b> HC/{state.session_id[:8].upper()}/{datetime.now().strftime('%Y%m%d')}", normal_style))
        story.append(Spacer(1, 20))
        
        # 3. Salutation
        story.append(Paragraph(f"Dear <b>{state.name}</b>,", normal_style))
        story.append(Spacer(1, 12))
        story.append(Paragraph("Congratulations! We are pleased to inform you that your Personal Loan application has been approved based on your credit profile and income verification.", normal_style))
        story.append(Spacer(1, 20))
        
        # 4. Loan Details Table
        # Handle potential None values safely
        amount = state.loan_amount or 0
        tenure = state.loan_tenure or 12
        rate = state.interest_rate or 10.99
        processing_fee = amount * 0.01
        
        data = [
            ['Loan Details', 'Value'],
            ['Sanctioned Amount', f"INR {amount:,.2f}"],
            ['Loan Tenure', f"{tenure} Months"],
            ['Interest Rate', f"{rate}% per annum"],
            ['Processing Fee (1%)', f"INR {processing_fee:,.2f}"],
            ['EMI Start Date', 'Next Month Cycle']
        ]
        
        table = Table(data, colWidths=[200, 200])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (1, 0), colors.HexColor('#10B981')), # Header Green
            ('TEXTCOLOR', (0, 0), (1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        story.append(table)
        story.append(Spacer(1, 20))
        
        # 5. Terms
        story.append(Paragraph("<b>TERMS & CONDITIONS:</b>", styles['Heading4']))
        terms = [
            "1. This sanction is valid for 30 days from the date of issue.",
            "2. Disbursement is subject to final documentation and bank formalities.",
            "3. Interest rates are subject to change as per RB1 guidelines.",
            "4. Prepayment charges may apply as per bank policy."
        ]
        for term in terms:
            story.append(Paragraph(term, normal_style))
        
        story.append(Spacer(1, 30))
        
        # 6. Footer/Signature
        story.append(Paragraph("Authorized Signatory", styles['Italic']))
        story.append(Paragraph("<b>HIVE CAPITAL FINANCIAL SERVICES</b>", styles['Heading4']))
        story.append(Paragraph("(This is a digitally generated document and does not require a physical signature)", styles['Italic']))
        
        # Build PDF
        doc.build(story)
        
        # Store the download URL in state
        download_url = f"/download/{filename}"
        state.sanction_letter_url = download_url
            
        response_text = f"🎉 Congratulations {state.name}! Your Personal Loan of ₹{(state.loan_amount or 0):,.2f} has been officially sanctioned!\n\n"
        response_text += "Your Sanction Letter has been generated and will be downloaded automatically.\n\n"
        response_text += "Thank you for choosing Hive Capital! 🙏"
        
        # Log final success
        state.audit_log.append(f"Sanction Letter Generated for ₹{state.loan_amount:,.2f}")
        
        manager.save_state(state)
        return response_text

