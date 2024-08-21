import { describe, it, expect } from 'vitest';
import { ValidationError } from '../../errors.js';
import { validateLandingRequestData } from '../../controllers/landing-controller';
// Define a valid example input that matches the LandingInputSchema
const validExampleData = {
    siteName: 'Example Site',
    url: 'https://example.com',
    contactData: {
        email: 'example@example.com',
    },
    colors: {
        primary: '#000000',
        accent: '#FFFFFF',
    },
    page: {
        sections: [
            {
                headline: 'Example Headline',
                reviews: [
                    {
                        text: 'Great service!',
                    },
                ],
            },
        ],
    },
    customOptions: {},
    logos: {},
};
describe('validateLandingRequestData', () => {
    it('should return parsed data for valid input', () => {
        const req = { body: validExampleData };
        const result = validateLandingRequestData(req);
        expect(result.siteData).toEqual(req.body);
        expect(result.apexID).toBeTruthy();
    });
    it('should throw a ValidationError for invalid input', () => {
        const req = {
            body: {
                ...validExampleData,
                contactData: {
                    email: 'invalid-email',
                },
            },
        };
        try {
            validateLandingRequestData(req);
        }
        catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toBe('Error validating form fields');
            expect(error.errorType).toBe('VAL-004');
            expect(error.state.erroredFields).toContainEqual({
                fieldPath: ['email'],
                message: 'Invalid email',
            });
        }
    });
    it('should provide all field error data when multiple are present', () => {
        const req = {
            body: {
                ...validExampleData,
                email: 'invalid-email',
                colors: {
                    primary: '#000000',
                    accent: 123, // invalid type
                },
            },
        };
        try {
            validateLandingRequestData(req);
        }
        catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toBe('Error validating form fields');
            expect(error.errorType).toBe('VAL-004');
            expect(error.state.erroredFields).toContainEqual({
                fieldPath: ['email'],
                message: 'Invalid email',
            });
            expect(error.state.erroredFields).toContainEqual({
                fieldPath: ['colors', 'accent'],
                message: 'Expected string, received number',
            });
        }
    });
    it('should throw a ValidationError when a required field is not present', () => {
        const req = {
            body: {
                ...validExampleData,
                siteName: undefined, // siteName is required
            },
        };
        try {
            validateLandingRequestData(req);
        }
        catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toBe('Error validating form fields');
            expect(error.errorType).toBe('VAL-004');
            expect(error.state.erroredFields).toContainEqual({
                fieldPath: ['siteName'],
                message: 'Required',
            });
        }
    });
    it('should NOT throw an error when an optional field is not included', () => {
        const req = {
            body: {
                ...validExampleData,
                favicon: undefined, // favicon is optional
            },
        };
        const result = validateLandingRequestData(req);
        expect(result.siteData).toEqual(req.body);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZGluZy12YWxpZGF0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdGVzdHMvZmVhdHVyZS9sYW5kaW5nLXZhbGlkYXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQU0sTUFBTSxRQUFRLENBQUE7QUFDakQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBQ2pELE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHNDQUFzQyxDQUFBO0FBRWpGLG1FQUFtRTtBQUNuRSxNQUFNLGdCQUFnQixHQUFHO0lBQ3JCLFFBQVEsRUFBRSxjQUFjO0lBQ3hCLEdBQUcsRUFBRSxxQkFBcUI7SUFDMUIsV0FBVyxFQUFFO1FBQ1QsS0FBSyxFQUFFLHFCQUFxQjtLQUMvQjtJQUNELE1BQU0sRUFBRTtRQUNKLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLE1BQU0sRUFBRSxTQUFTO0tBQ3BCO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsUUFBUSxFQUFFO1lBQ047Z0JBQ0ksUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsT0FBTyxFQUFFO29CQUNMO3dCQUNJLElBQUksRUFBRSxnQkFBZ0I7cUJBQ3pCO2lCQUNKO2FBQ0o7U0FDSjtLQUNKO0lBQ0QsYUFBYSxFQUFFLEVBQUU7SUFDakIsS0FBSyxFQUFFLEVBQUU7Q0FDWixDQUFBO0FBRUQsUUFBUSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO1FBQ2pELE1BQU0sR0FBRyxHQUFHLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLENBQUE7UUFDdEMsTUFBTSxNQUFNLEdBQUcsMEJBQTBCLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENB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