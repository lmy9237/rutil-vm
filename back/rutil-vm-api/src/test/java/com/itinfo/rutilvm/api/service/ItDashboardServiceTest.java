package com.itinfo.rutilvm.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ItDashboardServiceTest {
    @Autowired
    ItDashboardService dashboardService;

    @Test
    @DisplayName("대시보드 - 데이터센터 개수")
    void getDatacenters() {
        int upResult = dashboardService.getDatacenters("up");
        int downResult = dashboardService.getDatacenters("down");
        int totalResult = dashboardService.getDatacenters("");

        System.out.println(upResult);
        System.out.println(downResult);
        System.out.println(totalResult);

        assertThat(1).isEqualTo(upResult);
        assertThat(1).isEqualTo(downResult);
        assertThat(2).isEqualTo(totalResult);
    }

    @Test
    @DisplayName("대시보드 - 클러스터 개수")
    void getClusters() {
        System.out.println(dashboardService.getClusters());

        assertThat(2).isEqualTo(dashboardService.getClusters());
    }

    @Test
    @DisplayName("대시보드 - 호스트 개수")
    void gethosts() {
        int upResult = dashboardService.getHosts("up");
        int downResult = dashboardService.getHosts("down");
        int totalResult = dashboardService.getHosts("");

        System.out.println(upResult);
        System.out.println(downResult);
        System.out.println(totalResult);

        assertThat(2).isEqualTo(upResult);
        assertThat(0).isEqualTo(downResult);
        assertThat(2).isEqualTo(totalResult);

    }

    @Test
    @DisplayName("대시보드 - 가상머신 개수")
    void getvms() {
        int upResult = dashboardService.getVms("up");
        int downResult = dashboardService.getVms("down");
        int totalResult = dashboardService.getVms("");

        System.out.println(upResult);
        System.out.println(downResult);
        System.out.println(totalResult);

        assertThat(3).isEqualTo(upResult);
        assertThat(1).isEqualTo(downResult);
        assertThat(4).isEqualTo(totalResult);
    }

    @Test
    @DisplayName("대시보드 - 스토리지 도메인 개수")
    void getStorages() {
        int totalResult = dashboardService.getStorages();
        System.out.println(totalResult);

        assertThat(2).isEqualTo(totalResult);
    }

    @Test
    void getEvents() {
    }

    @Test
    @DisplayName("cpu값?")
    void getCpu() {
        System.out.println(dashboardService.getCpu());
    }

    @Test
    void getMemory() {
    }

    @Test
    void getStorage() {
    }
}