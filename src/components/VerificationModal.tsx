import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

/**
 * Identity verification is deliberately NOT collected.
 *
 * The previous funnel (kept on disk as verification/_legacy_VerificationModal.tsx.bak
 * and verification/steps/**) asked for SSN, EIN, bank account and routing numbers,
 * selfies, and Aadhaar/PAN - Indian national ID documents inherited from the template
 * this project was forked from.
 *
 * None of that is collected now, for three reasons:
 *  1. It contradicts the product. Overland verifies that an email is reachable and
 *     states plainly that everything else is the user's responsibility.
 *  2. Holding SSNs and bank credentials with no backend, no encryption at rest and no
 *     compliance programme is an unmanaged breach liability.
 *  3. Collecting Indian identity documents on a US freight platform is simply wrong.
 *
 * This modal now explains that, and points people at the public FMCSA register, which
 * is where counterparty checks actually belong.
 */

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerificationModal = ({ isOpen, onClose }: VerificationModalProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-[460px]">
      <span className="aon-eyebrow">Verification</span>
      <h2 className="aon-display mt-2 text-[24px]">We only verify your email.</h2>

      <p className="mt-4 text-[14px] leading-[1.7]" style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.62)' }}>
        Overland does not collect identity documents, tax numbers or bank details. We
        confirm your email address is real and nothing beyond that.
      </p>
      <p className="mt-3 text-[14px] leading-[1.7]" style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.62)' }}>
        Checking who you are dealing with is yours to do. Every carrier&rsquo;s authority,
        insurance and safety record is public on the FMCSA register.
      </p>

      <a
        href="https://safer.fmcsa.dot.gov/CompanySnapshot.aspx"
        target="_blank"
        rel="noopener noreferrer"
        className="aon-cta aon-cta--dark mt-6"
      >
        Look up a carrier on FMCSA
      </a>
      <button type="button" onClick={onClose} className="aon-cta aon-cta--ghost mt-2">Close</button>
    </DialogContent>
  </Dialog>
);

export default VerificationModal;
