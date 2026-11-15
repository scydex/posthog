import { useFeatureFlag } from 'lib/hooks/useFeatureFlag'

// The first send shows up in the Transactional emails tab, which needs the API flag too.
export function useSendFromCodeOffered(): boolean {
    const codeSendsOn = useFeatureFlag('WORKFLOWS_EMAIL_FROM_CODE')
    const transactionalTabOn = useFeatureFlag('WORKFLOWS_TRANSACTIONAL_EMAIL_API')
    return codeSendsOn && transactionalTabOn
}
