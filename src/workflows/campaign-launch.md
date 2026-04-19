# Workflow: Meta Ads Campaign Launch

This workflow guides an agent through generating ad creatives and launching a Meta campaign.

## Steps

1. **Generate Creative**
   - Use the `generateAdImage` tool to create 3 variations of ad visuals based on the product description.

2. **Draft Ad Copy**
   - Write 3 variations of headlines and primary text using "Hook, Story, Offer" structure.

3. **Create Campaign**
   - Use the `createCampaign` tool to set up the campaign in the Meta Ad Account.
   - Set status to `PAUSED` for manual review.

4. **Notification**
   - Use the `sendAlert` tool to notify the owner that the campaign is ready for approval.

## Success Criteria
- Ad images are saved in the database.
- Campaign exists in Meta Ads Manager (Paused).
- Owner received a notification with links to preview the ads.
