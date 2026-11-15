import { useActions, useValues } from 'kea'

import { LemonBanner } from '@posthog/lemon-ui'

import { useFeatureFlag } from 'lib/hooks/useFeatureFlag'
import { integrationsLogic } from 'lib/integrations/integrationsLogic'

import { ChannelSetupModal } from '../../Channels/ChannelSetupModal'
import { EmailIntegrationsList } from '../../Channels/EmailIntegrationsList'
import { SendFromCodeNextCard } from '../../Transactional/sendFromCode/SendFromCodeNextCard'
import { sendingDomainLogic } from '../../Transactional/sendFromCode/sendingDomainLogic'
import { workflowsOnboardingWizardLogic } from './workflowsOnboardingWizardLogic'

export function WizardDomainStep(): JSX.Element {
    const { stepDone } = useValues(workflowsOnboardingWizardLogic)
    // A domain's "Configure" button opens this modal through integrationsLogic, so the step has to render it.
    const { setupModalOpen, setupModalType, selectedIntegration } = useValues(integrationsLogic)
    const { closeSetupModal } = useActions(integrationsLogic)
    const { sendingDomain } = useValues(sendingDomainLogic)
    // The Transactional emails tab, where the first send shows up, needs the API flag too.
    const codeSendsOn = useFeatureFlag('WORKFLOWS_EMAIL_FROM_CODE')
    const transactionalTabOn = useFeatureFlag('WORKFLOWS_TRANSACTIONAL_EMAIL_API')
    const offerCodeSends = codeSendsOn && transactionalTabOn

    return (
        <div className="flex flex-col gap-4">
            <ChannelSetupModal
                isOpen={setupModalOpen}
                channelType={setupModalType}
                integration={selectedIntegration || undefined}
                onClose={closeSetupModal}
                onComplete={closeSetupModal}
            />
            {stepDone?.domain ? (
                <LemonBanner type="success">Your domain is verified. Your email is ready to send.</LemonBanner>
            ) : (
                <LemonBanner type="info">
                    Open your domain below to see its DNS records. Add them at your DNS provider, then verify. Emails
                    send only after the domain is verified.
                </LemonBanner>
            )}
            <EmailIntegrationsList />
            {/* Onboarding goes on to a workflow, so sending from code comes second here. */}
            {offerCodeSends && sendingDomain?.status === 'verified' ? (
                <SendFromCodeNextCard
                    surface="workflows_onboarding"
                    eyebrow="Or send from your code"
                    from={sendingDomain.from}
                    fromAddress={sendingDomain.email}
                />
            ) : null}
        </div>
    )
}
