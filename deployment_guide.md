# Deployment Guide - Personal Expense Dashboard

Aapka dashboard ab puri tarah se Google Sheets se connected hai. Ise internet par live karne ke liye **Vercel** sabse accha aur free option hai.

Niche diye gaye do tarikon mein se koi bhi ek chun sakte hain:

---

## Option 1: Manual Drag & Drop (Sabse Aasan)
Agar aap bina GitHub ke turant live karna chahte hain:
1. **Build Karein**: Apne terminal/editor mein ye command chalayein:
2.    ```powershell
         npm run build
         ```
         Isse aapke project folder mein ek naya `dist` naam ka folder ban jayega.
  2. **Vercel Par Jayein**: [vercel.com](https://vercel.com/) par account banayein ya login karein.
  3. 3. **Upload**: Vercel dashboard par "Add New" > "Project" par click karein aur apna **`dist`** folder wahan drag and drop kar dein.
     4. 4. **Live**: Kuch hi seconds mein aapko ek link mil jayega (e.g., `my-expenses.vercel.app`).
       
        5. ---
       
        6. ## Option 2: GitHub Integration (Best for Updates)
        7. Agar aap chahte hain ki future mein code change karte hi automatic update ho jaye:
        8. 1. **GitHub Par Push Karein**: Apna code GitHub repository mein upload karein.
           2. 2. **Connect to Vercel**: Vercel par "Add New" > "Project" karein aur apni repository select karein.
              3. 3. **Deploy**: "Deploy" button dabayein. Ab jab bhi aap GitHub par code push karenge, dashboard automatically update ho jayega.
                
                 4. ---
                
                 5. ## Important Note: Google Sheets API
                 6. Aapka Google Sheets ka `API_URL` already code mein (App.jsx) hardcoded hai. Isliye deployment ke baad bhi data sync rahega, aapko alag se koi environment variable set karne ki zarurat nahi hai.
                
                 7. ---
                
                 8. ### Verification Checklist
                 9. - [ ] Kya `dist` folder ban gaya? (`npm run build` ke baad)
                    - [ ] - [ ] Kya dashboard live link par data dikha raha hai?
                    - [ ] - [ ] Kya dashboard se save kiya hua data wapis Google Sheet mein ja raha hai?
                   
                    - [ ] Aap Option 1 (Drag & Drop) se shuru kar sakte hain, wo sabse fast hai!
                    - [ ] 
