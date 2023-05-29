/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Utils from "@support/utils";

describe("publisher-009-00 : Api Definition - Download API", () => {
    const { publisher, password,  superTenant, testTenant } = Utils.getUserInfo();
    const apiName = Utils.generateName();
    const apiVersion = '1.0.0';

    const downloadApi = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPI({ name: apiName, version: apiVersion }).then((apiId) => {
            cy.visit({url:`/publisher/apis/${apiId}/overview`, retryOnStatusCodeFailure: true});
            cy.get('#itest-api-details-api-config-acc').click();
            cy.get('#left-menu-itemAPIdefinition').click();
            cy.get('#download-api-btn').click();

            // Downloading API
            const fileName = `${publisher}-${apiName}-${apiVersion}`;
            const downloadsFolder = Cypress.config('downloadsFolder')
            const downloadedFilename = `${downloadsFolder}/${fileName}.zip`;

            cy.readFile(downloadedFilename, 'binary', { timeout: 15000 })
                .should(buffer => expect(buffer.length).to.be.gt(100));
            // Test is done. Now delete the api
            Utils.deleteAPI(apiId);
        });
    }

    it.only("Download api - super admin", () => {
        downloadApi(superTenant);
    });
    it.only("Download api - tenant user", () => {
        downloadApi(testTenant);
    });
});
